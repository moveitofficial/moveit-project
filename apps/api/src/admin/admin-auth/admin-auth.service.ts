import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

import { AUTH_ERRORS } from '../../common/constants/errors';
import { AppException } from '../../common/exceptions/app.exception';
import { AdminAccountService } from '../admin-account/admin-account.service';

import {
  ADMIN_ACCESS_COOKIE_NAME,
  ADMIN_ACCESS_JWT_EXPIRES_IN,
  ADMIN_ACCESS_MAX_AGE_MS,
  ADMIN_JWT_ACCESS_TYP,
  ADMIN_JWT_REFRESH_TYP,
  ADMIN_REFRESH_COOKIE_NAME,
  ADMIN_REFRESH_JWT_EXPIRES_IN,
  ADMIN_REFRESH_MAX_AGE_MS,
} from './admin-auth.constants';

import type {
  AdminJwtAccessPayload,
  AdminJwtRefreshPayload,
} from './admin-auth.types';
import type { AdminSignInRequestDto } from './dto/admin-sign-in-request.dto';
import type { Admin } from '@prisma/client';
import type { Response } from 'express';

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly adminAccountService: AdminAccountService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async signIn(dto: AdminSignInRequestDto) {
    const admin = await this.adminAccountService.getAdminByEmail(dto.email);
    if (admin === null) {
      throw new AppException(AUTH_ERRORS.INVALID_CREDENTIALS);
    }

    const passwordOk = await bcrypt.compare(dto.password, admin.password);
    if (!passwordOk) {
      throw new AppException(AUTH_ERRORS.INVALID_CREDENTIALS);
    }

    await this.adminAccountService.updateLastLoginAt(admin.id);

    const { accessToken, refreshToken } = this.#issueTokens(admin);
    return { admin: this.#toPublic(admin), accessToken, refreshToken };
  }

  setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ): void {
    const secure = this.config.get<string>('NODE_ENV') === 'production';
    const base = {
      httpOnly: true,
      secure,
      sameSite: 'lax' as const,
      path: '/',
    };
    res.cookie(ADMIN_ACCESS_COOKIE_NAME, accessToken, {
      ...base,
      maxAge: ADMIN_ACCESS_MAX_AGE_MS,
    });
    res.cookie(ADMIN_REFRESH_COOKIE_NAME, refreshToken, {
      ...base,
      maxAge: ADMIN_REFRESH_MAX_AGE_MS,
    });
  }

  clearAuthCookies(res: Response): void {
    const secure = this.config.get<string>('NODE_ENV') === 'production';
    const base = {
      httpOnly: true,
      secure,
      sameSite: 'lax' as const,
      path: '/',
    };
    res.clearCookie(ADMIN_ACCESS_COOKIE_NAME, base);
    res.clearCookie(ADMIN_REFRESH_COOKIE_NAME, base);
  }

  #issueTokens(admin: Admin) {
    const accessPayload: AdminJwtAccessPayload = {
      sub: admin.id,
      email: admin.email,
      isSuper: admin.isSuper,
      typ: ADMIN_JWT_ACCESS_TYP,
    };
    const accessToken = this.jwtService.sign(accessPayload, {
      expiresIn: ADMIN_ACCESS_JWT_EXPIRES_IN,
    });

    const refreshPayload: AdminJwtRefreshPayload = {
      sub: admin.id,
      typ: ADMIN_JWT_REFRESH_TYP,
    };
    const refreshToken = this.jwtService.sign(refreshPayload, {
      expiresIn: ADMIN_REFRESH_JWT_EXPIRES_IN,
    });

    return { accessToken, refreshToken };
  }

  #toPublic(admin: Admin) {
    return {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      isSuper: admin.isSuper,
      mustChangePassword: admin.mustChangePassword,
    };
  }
}
