import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { AuthPrincipal } from '../common/interfaces/auth-principal.interface';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { InstitutionStatusDto } from './dto/institution-status.dto';
import { ClaimDecisionDto } from './dto/claim-decision.dto';

@Injectable()
export class VerificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly users: UsersService,
  ) {}

  async createInstitution(principal: AuthPrincipal, dto: CreateInstitutionDto) {
    const actor = await this.users.upsertFromPrincipal(principal);
    if (actor.status !== 'ACTIVE') throw new ConflictException('This account cannot create institution records.');

    return this.prisma.$transaction(async (tx) => {
      const institution = await tx.institution.create({
        data: {
          slug: dto.slug,
          name: dto.name,
          type: dto.type,
          city: dto.city,
          state: dto.state,
          locality: dto.locality,
          description: dto.description,
          websiteUrl: dto.websiteUrl,
          status: 'PENDING_VERIFICATION',
        },
        select: { id: true, slug: true, name: true, type: true, status: true, city: true, state: true, createdAt: true },
      });
      await tx.auditLog.create({
        data: {
          actorUserId: actor.id,
          action: 'institution.created_for_verification',
          entityType: 'institution',
          entityId: institution.id,
          metadata: { slug: institution.slug },
        },
      });
      return institution;
    });
  }

  async updateInstitutionStatus(
    institutionId: string,
    principal: AuthPrincipal,
    dto: InstitutionStatusDto,
  ) {
    const actor = await this.users.upsertFromPrincipal(principal);
    if (actor.status !== 'ACTIVE') throw new ConflictException('This account cannot verify institution records.');

    return this.prisma.$transaction(async (tx) => {
      const previous = await tx.institution.findUnique({ where: { id: institutionId }, select: { id: true, status: true } });
      if (!previous) throw new NotFoundException('Institution not found.');
      if (previous.status === 'ARCHIVED' && dto.status !== 'ARCHIVED') {
        throw new BadRequestException('Archived institutions require a separate restoration process.');
      }

      const institution = await tx.institution.update({
        where: { id: institutionId },
        data: {
          status: dto.status,
          verifiedAt: dto.status === 'VERIFIED' ? (previous.status === 'VERIFIED' ? undefined : new Date()) : null,
        },
        select: { id: true, slug: true, name: true, status: true, verifiedAt: true, updatedAt: true },
      });
      await tx.auditLog.create({
        data: {
          actorUserId: actor.id,
          action: 'institution.status_changed',
          entityType: 'institution',
          entityId: institutionId,
          metadata: { previousStatus: previous.status, nextStatus: dto.status, reason: dto.reason },
        },
      });
      return institution;
    });
  }

  async listClaims() {
    return this.prisma.institutionClaim.findMany({
      where: { status: { in: ['SUBMITTED', 'IN_REVIEW'] } },
      orderBy: { createdAt: 'asc' },
      take: 100,
      select: {
        id: true,
        status: true,
        businessReason: true,
        createdAt: true,
        claimant: { select: { email: true, displayName: true, createdAt: true } },
        institution: { select: { id: true, name: true, slug: true, type: true, city: true, state: true, status: true } },
      },
    });
  }

  async decideClaim(claimId: string, principal: AuthPrincipal, decision: ClaimDecisionDto['decision'], reason: string) {
    const actor = await this.users.upsertFromPrincipal(principal);
    if (actor.status !== 'ACTIVE') throw new ConflictException('This account cannot decide verification claims.');

    return this.prisma.$transaction(async (tx) => {
      const claim = await tx.institutionClaim.findUnique({
        where: { id: claimId },
        select: { id: true, status: true, institutionId: true, claimantUserId: true },
      });
      if (!claim) throw new NotFoundException('Institution claim not found.');
      if (!['SUBMITTED', 'IN_REVIEW'].includes(claim.status)) {
        throw new BadRequestException('This claim has already been decided or withdrawn.');
      }

      const nextStatus = decision === 'APPROVE' ? 'APPROVED' : 'REJECTED';
      const updated = await tx.institutionClaim.update({
        where: { id: claimId },
        data: {
          status: nextStatus,
          reviewedById: actor.id,
          reviewedAt: new Date(),
          decisionNote: reason,
        },
        select: { id: true, status: true, reviewedAt: true, decisionNote: true, institutionId: true },
      });

      if (decision === 'APPROVE') {
        const ownerRole = await tx.role.findUnique({ where: { key: 'institution_owner' }, select: { id: true, scope: true } });
        if (!ownerRole || ownerRole.scope !== 'INSTITUTION') {
          throw new ConflictException('Institution owner role is not configured. Run the database seed.');
        }
        const existingMembership = await tx.organizationMembership.findUnique({
          where: { userId_institutionId: { userId: claim.claimantUserId, institutionId: claim.institutionId } },
          select: { id: true, status: true },
        });
        if (existingMembership?.status === 'ACTIVE') {
          throw new ConflictException('The claimant already has active institution access. Use the ownership-transfer workflow instead.');
        }
        await tx.organizationMembership.upsert({
          where: { userId_institutionId: { userId: claim.claimantUserId, institutionId: claim.institutionId } },
          create: {
            userId: claim.claimantUserId,
            institutionId: claim.institutionId,
            roleId: ownerRole.id,
            status: 'ACTIVE',
            acceptedAt: new Date(),
          },
          update: { roleId: ownerRole.id, status: 'ACTIVE', acceptedAt: new Date() },
        });
      }

      await tx.auditLog.create({
        data: {
          actorUserId: actor.id,
          action: `institution_claim.${decision.toLowerCase()}`,
          entityType: 'institution_claim',
          entityId: claimId,
          metadata: { institutionId: claim.institutionId, claimantUserId: claim.claimantUserId, reason },
        },
      });
      return updated;
    });
  }
}
