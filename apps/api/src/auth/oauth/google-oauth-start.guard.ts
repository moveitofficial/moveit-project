import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '@prisma/client';

import { AuthService } from '../auth.service';

@Injectable()
export class GoogleOAuthStartGuard extends AuthGuard('google') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  getAuthenticateOptions(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<{ query: { role?: string } }>();
    const role = this.#parseRoleQuery(req.query.role);
    return { state: this.authService.createOAuthState(role) };
  }

  #parseRoleQuery(role: string | undefined): Role {
    if (role !== undefined && Object.values(Role).includes(role as Role)) {
      return role as Role;
    }
    return Role.CLIENT;
  }
}
