import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ModerationActionType, ReviewStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { AuthPrincipal } from '../common/interfaces/auth-principal.interface';
import { ReviewModerationDecision } from './dto/moderation-decision.dto';

const decisionMap: Record<ReviewModerationDecision, { next: ReviewStatus; action: ModerationActionType; allowed: ReviewStatus[] }> = {
  [ReviewModerationDecision.PUBLISH]: { next: 'PUBLISHED', action: 'PUBLISH_CONTENT', allowed: ['PENDING'] },
  [ReviewModerationDecision.REJECT]: { next: 'REJECTED', action: 'REJECT_CONTENT', allowed: ['PENDING'] },
  [ReviewModerationDecision.HIDE]: { next: 'HIDDEN', action: 'HIDE_CONTENT', allowed: ['PUBLISHED'] },
  [ReviewModerationDecision.RESTORE]: { next: 'PUBLISHED', action: 'RESTORE_CONTENT', allowed: ['HIDDEN'] },
};

@Injectable()
export class ModerationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly users: UsersService,
  ) {}

  async listReviewQueue(status: ReviewStatus) {
    return this.prisma.review.findMany({
      where: { status },
      orderBy: { createdAt: 'asc' },
      take: 100,
      select: {
        id: true,
        perspective: true,
        overallRating: true,
        title: true,
        body: true,
        experienceYear: true,
        affiliationStatus: true,
        status: true,
        createdAt: true,
        categoryScores: { select: { score: true, category: { select: { key: true, label: true } } } },
        institution: { select: { id: true, slug: true, name: true, type: true, city: true, state: true } },
      },
    });
  }

  async listOpenCases() {
    return this.prisma.moderationCase.findMany({
      where: { status: { in: ['OPEN', 'IN_REVIEW', 'APPEALED'] } },
      orderBy: { createdAt: 'asc' },
      take: 100,
      select: {
        id: true,
        status: true,
        reasonCode: true,
        summary: true,
        createdAt: true,
        review: { select: { id: true, title: true, overallRating: true, status: true } },
        report: { select: { id: true, reason: true, details: true } },
        institution: { select: { id: true, name: true, slug: true } },
      },
    });
  }

  async decideReview(
    reviewId: string,
    principal: AuthPrincipal,
    decision: ReviewModerationDecision,
    reason: string,
  ) {
    const moderator = await this.users.upsertFromPrincipal(principal);
    if (moderator.status !== 'ACTIVE') throw new ConflictException('This account cannot perform moderation actions.');

    const rule = decisionMap[decision];
    if (!rule) throw new BadRequestException('Unsupported moderation decision.');

    return this.prisma.$transaction(async (tx) => {
      const review = await tx.review.findUnique({
        where: { id: reviewId },
        select: { id: true, status: true, institutionId: true, publishedAt: true },
      });
      if (!review) throw new NotFoundException('Review not found.');
      if (!rule.allowed.includes(review.status)) {
        throw new BadRequestException(`Cannot ${decision.toLowerCase()} a review in ${review.status.toLowerCase()} state.`);
      }

      const now = new Date();
      const updated = await tx.review.update({
        where: { id: reviewId },
        data: {
          status: rule.next,
          publishedAt: rule.next === 'PUBLISHED' ? now : review.publishedAt,
        },
        select: { id: true, status: true, publishedAt: true, updatedAt: true },
      });

      await tx.moderationCase.updateMany({
        where: { reviewId, status: { in: ['OPEN', 'IN_REVIEW', 'APPEALED'] } },
        data: { status: 'ACTIONED', resolvedAt: now },
      });

      await tx.moderationCase.create({
        data: {
          reviewId,
          institutionId: review.institutionId,
          status: 'ACTIONED',
          reasonCode: `REVIEW_${decision}`,
          summary: reason,
          resolvedAt: now,
          actions: {
            create: { actorUserId: moderator.id, action: rule.action, reason },
          },
        },
      });

      await tx.auditLog.create({
        data: {
          actorUserId: moderator.id,
          action: `review.${decision.toLowerCase()}`,
          entityType: 'review',
          entityId: reviewId,
          metadata: { previousStatus: review.status, nextStatus: rule.next, reason },
        },
      });

      return updated;
    });
  }
}
