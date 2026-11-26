import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import { REQUIRED_PERMISSION_KEY } from '../decorators/require-permission.decorator';
import { AuthPrincipal } from '../interfaces/auth-principal.interface';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permission = this.reflector.getAllAndOverride<string>(REQUIRED_PERMISSION_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!permission) return true;

    const request = context.switchToHttp().getRequest<{
      user?: AuthPrincipal;
      params: Record<string, string>;
    }>();
    if (!request.user) throw new UnauthorizedException();

    const institutionId = request.params.institutionId;
    if (institutionId) {
      const membership = await this.prisma.organizationMembership.findFirst({
        where: {
          institutionId,
          status: 'ACTIVE',
          role: { scope: 'INSTITUTION' },
          user: {
            externalIssuer: request.user.issuer,
            externalSubject: request.user.sub,
            status: 'ACTIVE',
          },
        },
        include: { role: { include: { permissions: { include: { permission: true } } } } },
      });

      const hasPermission = membership?.role.scope === 'INSTITUTION' && membership.role.permissions.some(
        (item) => item.permission.key === permission,
      );
      if (!hasPermission) throw new ForbiddenException('You do not have permission for this institution.');
      return true;
    }

    const globalAssignment = await this.prisma.userRoleAssignment.findFirst({
      where: {
        user: {
          externalIssuer: request.user.issuer,
          externalSubject: request.user.sub,
          status: 'ACTIVE',
        },
        role: {
          scope: 'GLOBAL',
          permissions: { some: { permission: { key: permission } } },
        },
      },
      select: { userId: true },
    });
    if (!globalAssignment) throw new ForbiddenException('You do not have this platform permission.');
    return true;
  }
}
