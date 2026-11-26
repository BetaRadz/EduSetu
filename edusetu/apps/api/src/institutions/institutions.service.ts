import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { AuthPrincipal } from '../common/interfaces/auth-principal.interface';
import { SearchInstitutionsDto } from './dto/search-institutions.dto';

@Injectable()
export class InstitutionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly users: UsersService,
  ) {}

  async search(query: SearchInstitutionsDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const where = {
      status: 'VERIFIED' as const,
      ...(query.city ? { city: { contains: query.city.trim(), mode: 'insensitive' as const } } : {}),
      ...(query.type ? { type: query.type } : {}),
      ...(query.q
        ? {
            OR: [
              { name: { contains: query.q, mode: 'insensitive' as const } },
              { city: { contains: query.q, mode: 'insensitive' as const } },
              { locality: { contains: query.q, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.institution.findMany({
        where,
        orderBy: [{ name: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          slug: true,
          name: true,
          type: true,
          city: true,
          state: true,
          locality: true,
          verifiedAt: true,
          _count: { select: { reviews: { where: { status: 'PUBLISHED' } } } },
        },
      }),
      this.prisma.institution.count({ where }),
    ]);

    return {
      data: items.map((item) => ({ ...item, publishedReviewCount: item._count.reviews, _count: undefined })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findPublicProfile(slug: string) {
    const institution = await this.prisma.institution.findFirst({
      where: { slug, status: 'VERIFIED' },
      select: {
        id: true,
        slug: true,
        name: true,
        type: true,
        description: true,
        websiteUrl: true,
        addressLine1: true,
        locality: true,
        city: true,
        state: true,
        postalCode: true,
        verifiedAt: true,
        createdAt: true,
        _count: { select: { reviews: { where: { status: 'PUBLISHED' } } } },
      },
    });
    if (!institution) throw new NotFoundException('Institution not found.');

    const aggregate = await this.prisma.review.aggregate({
      where: { institutionId: institution.id, status: 'PUBLISHED' },
      _avg: { overallRating: true },
    });

    return {
      ...institution,
      rating: aggregate._avg.overallRating ? Number(aggregate._avg.overallRating.toFixed(2)) : null,
      publishedReviewCount: institution._count.reviews,
      _count: undefined,
    };
  }

  async submitClaim(institutionId: string, principal: AuthPrincipal, businessReason?: string) {
    const user = await this.users.upsertFromPrincipal(principal);
    const institution = await this.prisma.institution.findUnique({ where: { id: institutionId }, select: { id: true } });
    if (!institution) throw new NotFoundException('Institution not found.');
    if (user.status !== 'ACTIVE') throw new ConflictException('This account cannot submit institution claims.');

    try {
      return await this.prisma.$transaction(async (tx) => {
        const existing = await tx.institutionClaim.findUnique({
          where: { institutionId_claimantUserId: { institutionId, claimantUserId: user.id } },
          select: { id: true, status: true },
        });
        if (existing && ['SUBMITTED', 'IN_REVIEW', 'APPROVED'].includes(existing.status)) {
          throw new ConflictException('You already have an active claim for this institution.');
        }

        const claim = existing
          ? await tx.institutionClaim.update({
              where: { id: existing.id },
              data: {
                status: 'SUBMITTED',
                businessReason,
                reviewedById: null,
                reviewedAt: null,
                decisionNote: null,
              },
              select: { id: true, institutionId: true, status: true, createdAt: true },
            })
          : await tx.institutionClaim.create({
              data: { institutionId, claimantUserId: user.id, businessReason, status: 'SUBMITTED' },
              select: { id: true, institutionId: true, status: true, createdAt: true },
            });

        await tx.auditLog.create({
          data: {
            actorUserId: user.id,
            action: existing ? 'institution_claim.resubmitted' : 'institution_claim.submitted',
            entityType: 'institution_claim',
            entityId: claim.id,
            metadata: { institutionId },
          },
        });
        return claim;
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('A claim for this institution already exists for this account.');
      }
      throw error;
    }
  }
}
