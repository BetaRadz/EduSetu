import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthPrincipal } from '../common/interfaces/auth-principal.interface';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async upsertFromPrincipal(principal: AuthPrincipal) {
    return this.prisma.user.upsert({
      where: { externalIssuer_externalSubject: { externalIssuer: principal.issuer, externalSubject: principal.sub } },
      create: {
        externalIssuer: principal.issuer,
        externalSubject: principal.sub,
        email: principal.email,
        displayName: principal.name,
      },
      update: {
        ...(principal.email ? { email: principal.email } : {}),
        ...(principal.name ? { displayName: principal.name } : {}),
      },
      select: {
        id: true,
        email: true,
        displayName: true,
        status: true,
        createdAt: true,
      },
    });
  }
}
