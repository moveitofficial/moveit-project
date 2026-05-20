import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from '../../auth.service';

@Injectable()
export class KakaoOAuthStartGuard extends AuthGuard('kakao') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  getAuthenticateOptions(_context: ExecutionContext) {
    return {
      state: this.authService.createOAuthState(),
      scope: ['profile_nickname', 'profile_image', 'account_email'],
    };
  }
}
