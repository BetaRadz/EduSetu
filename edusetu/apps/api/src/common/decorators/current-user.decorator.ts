import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthPrincipal } from '../interfaces/auth-principal.interface';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthPrincipal => {
    const request = context.switchToHttp().getRequest<{ user: AuthPrincipal }>();
    return request.user;
  },
);
