import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { createRemoteJWKSet, jwtVerify, JWTPayload } from 'jose';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { AuthPrincipal } from '../interfaces/auth-principal.interface';

type AuthenticatedRequest = Request & { user?: AuthPrincipal };

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);
  private remoteJwks?: ReturnType<typeof createRemoteJWKSet>;

  constructor(
    private readonly reflector: Reflector,
    private readonly config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    if (this.config.get<string>('AUTH_ENABLED') !== 'true') {
      throw new UnauthorizedException('Authentication is not configured.');
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractBearerToken(request);
    if (!token) throw new UnauthorizedException('A bearer token is required.');

    const issuer = this.config.getOrThrow<string>('OIDC_ISSUER');
    const jwksUrl = this.config.getOrThrow<string>('OIDC_JWKS_URL');
    const audience = this.config.getOrThrow<string>('OIDC_AUDIENCE');

    try {
      this.remoteJwks ??= createRemoteJWKSet(new URL(jwksUrl));
      const { payload } = await jwtVerify(token, this.remoteJwks, { issuer });
      const tokenAudiences = Array.isArray(payload.aud)
        ? payload.aud
        : typeof payload.aud === 'string'
          ? [payload.aud]
          : [];
      const audienceMatches = tokenAudiences.includes(audience) || payload.client_id === audience;
      if (!audienceMatches) throw new UnauthorizedException('The token was not issued for this API.');
      if (typeof payload.token_use === 'string' && payload.token_use !== 'access') {
        throw new UnauthorizedException('An access token is required.');
      }
      request.user = this.toPrincipal(payload, issuer);
      return true;
    } catch (error) {
      this.logger.debug(`Bearer token rejected: ${error instanceof Error ? error.message : 'unknown error'}`);
      throw new UnauthorizedException('The bearer token is invalid or expired.');
    }
  }

  private extractBearerToken(request: Request): string | undefined {
    const authorization = request.headers.authorization;
    if (!authorization) return undefined;
    const match = /^Bearer\s+(.+)$/i.exec(authorization);
    return match?.[1];
  }

  private toPrincipal(payload: JWTPayload, issuer: string): AuthPrincipal {
    if (typeof payload.sub !== 'string' || payload.sub.length === 0) {
      throw new UnauthorizedException('The identity token has no subject.');
    }
    return {
      sub: payload.sub,
      issuer,
      email: typeof payload.email === 'string' ? payload.email : undefined,
      name: typeof payload.name === 'string' ? payload.name : undefined,
    };
  }
}
