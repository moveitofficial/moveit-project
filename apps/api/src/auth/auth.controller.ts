import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { SignUpRequestDto } from './dto/sign-up-request.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '이메일 회원가입 (LOCAL)' })
  async signUp(@Body() body: SignUpRequestDto) {
    const data = await this.authService.signUpWithEmail(body);
    return {
      success: true,
      message: '회원가입이 완료되었습니다.',
      data,
    };
  }
}
