import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from '../../auth.service';

@Injectable()
export class NaverOAuthStartGuard extends AuthGuard('naver') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  getAuthenticateOptions(_context: ExecutionContext) {
    return { state: this.authService.createOAuthState() };
  }
}
