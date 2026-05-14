import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { SignInRequestDto } from './dto/sign-in-request.dto';
import { SignUpRequestDto } from './dto/sign-up-request.dto';

import type { Response } from 'express';

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

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '이메일 로그인 (LOCAL)' })
  async signIn(
    @Body() body: SignInRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.signInWithEmail(body);
    this.authService.setAuthCookies(res, accessToken, refreshToken);
    return {
      success: true,
      message: '로그인되었습니다.',
      data: { user },
    };
  }
}
