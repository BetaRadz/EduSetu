import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, ReviewPerspective } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { AuthPrincipal } from '../common/interfaces/auth-principal.interface';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly users: UsersService,
  ) {}

  async listPublished(institutionId: string, page = 1, limit = 20) {
    const institution = await this.prisma.institution.findFirst({ where: { id: institutionId, status: 'VERIFIED' }, select: { id: true } });
    if (!institution) throw new NotFoundException('Verified institution not found.');
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(50, Math.max(1, limit));
    const where = { institutionId, status: 'PUBLISHED' as const };
    const [items, total, aggregate] = await this.prisma.$transaction([
      this.prisma.review.findMany({
        where,
        orderBy: [{ publishedAt: 'desc' }],
        skip: (safePage - 1) * safeLimit,
        take: safeLimit,
        select: {
          id: true,
          perspective: true,
          overallRating: true,
          title: true,
          body: true,
          experienceYear: true,
          affiliationStatus: true,
          publishedAt: true,
          categoryScores: { select: { score: true, category: { select: { key: true, label: true } } } },
          responses: { select: { body: true, createdAt: true } },
        },
      }),
      this.prisma.review.count({ where }),
      this.prisma.review.aggregate({ where, _avg: { overallRating: true } }),
    ]);

    return {
      data: items,
      summary: {
        count: total,
        averageRating: aggregate._avg.overallRating ? Number(aggregate._avg.overallRating.toFixed(2)) : null,
      },
      pagination: { page: safePage, limit: safeLimit, total, totalPages: Math.ceil(total / safeLimit) },
    };
  }

  async create(institutionId: string, principal: AuthPrincipal, dto: CreateReviewDto) {
    const institution = await this.prisma.institution.findFirst({
      where: { id: institutionId, status: 'VERIFIED' },
      select: { id: true },
    });
    if (!institution) throw new NotFoundException('Verified institution not found.');

    const user = await this.users.upsertFromPrincipal(principal);
    if (user.status !== 'ACTIVE') throw new ConflictException('This account cannot submit reviews.');
    if (dto.perspective === ReviewPerspective.STUDENT) {
      throw new ConflictException('Student reviews are disabled until guardian-consent and age-safety workflows are implemented.');
    }
    const existing = await this.prisma.review.findUnique({
      where: { institutionId_authorUserId: { institutionId, authorUserId: user.id } },
      select: { id: true },
    });
    if (existing) throw new ConflictException('One review per account is currently permitted for this institution.');

    const staffMembership = await this.prisma.organizationMembership.findFirst({
      where: { userId: user.id, institutionId, status: 'ACTIVE' },
      select: { id: true },
    });
    if (staffMembership) throw new ConflictException('Institution team members cannot review their own institution.');

    const categoryKeys = (dto.categoryScores ?? []).map((score) => score.categoryKey);
    if (new Set(categoryKeys).size !== categoryKeys.length) {
      throw new ConflictException('A review category can only be scored once.');
    }

    const categories = categoryKeys.length
      ? await this.prisma.reviewCategory.findMany({ where: { key: { in: categoryKeys }, isActive: true } })
      : [];
    if (categories.length !== categoryKeys.length) {
      throw new NotFoundException('One or more review categories are unavailable.');
    }

    try {
      return await this.prisma.$transaction(async (tx) => {
        const created = await tx.review.create({
          data: {
            institutionId,
            authorUserId: user.id,
            perspective: dto.perspective,
            overallRating: dto.overallRating,
            title: dto.title,
            body: dto.body,
            experienceYear: dto.experienceYear,
            status: 'PENDING',
            categoryScores: {
              create: (dto.categoryScores ?? []).map((score) => ({
                score: score.score,
                category: { connect: { key: score.categoryKey } },
              })),
            },
            revisions: {
              create: {
                title: dto.title,
                body: dto.body,
                overallRating: dto.overallRating,
              },
            },
          },
          select: { id: true, status: true, createdAt: true },
        });
        await tx.auditLog.create({
          data: {
            actorUserId: user.id,
            action: 'review.submitted',
            entityType: 'review',
            entityId: created.id,
            metadata: { institutionId, perspective: dto.perspective },
          },
        });
        return created;
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('One review per account is currently permitted for this institution.');
      }
      throw error;
    }
  }

  async report(reviewId: string, principal: AuthPrincipal, reason: string, details?: string) {
    const review = await this.prisma.review.findFirst({ where: { id: reviewId, status: 'PUBLISHED' }, select: { id: true, institutionId: true, authorUserId: true } });
    if (!review) throw new NotFoundException('Published review not found.');
    const user = await this.users.upsertFromPrincipal(principal);
    if (user.status !== 'ACTIVE') throw new ConflictException('This account cannot report reviews.');
    if (review.authorUserId === user.id) throw new ConflictException('You cannot report your own review.');
    try {
      return await this.prisma.$transaction(async (tx) => {
        const report = await tx.reviewReport.create({
          data: { reviewId, reporterId: user.id, reason, details },
          select: { id: true, reviewId: true, reason: true, createdAt: true },
        });
        await tx.moderationCase.create({
          data: {
            reviewId,
            institutionId: review.institutionId,
            reportId: report.id,
            status: 'OPEN',
            reasonCode: 'USER_REPORTED_REVIEW',
            summary: `Report ${report.id}: ${reason}${details ? ` — ${details}` : ''}`.slice(0, 2000),
          },
        });
        await tx.auditLog.create({
          data: {
            actorUserId: user.id,
            action: 'review.reported',
            entityType: 'review',
            entityId: reviewId,
            metadata: { reportId: report.id, reason },
          },
        });
        return report;
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        return this.prisma.reviewReport.update({
          where: { reviewId_reporterId: { reviewId, reporterId: user.id } },
          data: { reason, details },
          select: { id: true, reviewId: true, reason: true, createdAt: true },
        });
      }
      throw error;
    }
  }

  async respond(institutionId: string, reviewId: string, principal: AuthPrincipal, body: string) {
    const user = await this.users.upsertFromPrincipal(principal);
    const review = await this.prisma.review.findFirst({
      where: { id: reviewId, institutionId, status: 'PUBLISHED' },
      select: { id: true },
    });
    if (!review) throw new NotFoundException('Published review not found for this institution.');

    if (user.status !== 'ACTIVE') throw new ConflictException('This account cannot respond to reviews.');
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.institutionResponse.findUnique({ where: { reviewId }, select: { id: true } });
      const response = await tx.institutionResponse.upsert({
        where: { reviewId },
        create: { reviewId, institutionId, authorUserId: user.id, body },
        update: { body, authorUserId: user.id },
        select: { id: true, reviewId: true, body: true, createdAt: true, updatedAt: true },
      });
      await tx.auditLog.create({
        data: {
          actorUserId: user.id,
          action: existing ? 'institution.review_response.updated' : 'institution.review_response.created',
          entityType: 'institution_response',
          entityId: response.id,
          metadata: { institutionId, reviewId },
        },
      });
      return response;
    });
  }
}
