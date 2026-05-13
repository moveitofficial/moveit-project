import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthProvider, Prisma, Role, type User } from '@prisma/client';
import bcrypt from 'bcrypt';

import { AppException } from '../common/exceptions/app.exception';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';

import {
  ACCESS_COOKIE_NAME,
  ACCESS_JWT_EXPIRES_IN,
  ACCESS_MAX_AGE_MS,
  JWT_ACCESS_TYP,
  JWT_REFRESH_TYP,
  REFRESH_COOKIE_NAME,
  REFRESH_JWT_EXPIRES_IN,
  REFRESH_MAX_AGE_MS,
} from './auth.constants';

import type {
  AuthPublicUser,
  JwtAccessPayload,
  JwtRefreshPayload,
} from './auth.types';
import type { SignInRequestDto } from './dto/sign-in-request.dto';
import type { SignUpRequestDto } from './dto/sign-up-request.dto';
import type { Response } from 'express';

const BCRYPT_COST = 12;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async signUpWithEmail(dto: SignUpRequestDto): Promise<{
    userId: string;
    role: Role;
    profileSetupCompleted: boolean;
  }> {
    if (dto.provider !== AuthProvider.LOCAL) {
      throw new AppException(
        HttpStatus.BAD_REQUEST,
        '이메일 회원가입은 LOCAL provider만 사용할 수 있습니다.',
        'AUTH_INVALID_PROVIDER',
      );
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_COST);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: passwordHash,
          name: dto.name,
          role: dto.role,
          provider: AuthProvider.LOCAL,
        },
      });

      return {
        userId: user.id,
        role: user.role,
        profileSetupCompleted: false,
      };
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new AppException(
          HttpStatus.CONFLICT,
          '이미 가입된 이메일입니다.',
          'AUTH_DUPLICATE_EMAIL',
        );
      }

      throw error;
    }
  }

  async signInWithEmail(dto: SignInRequestDto): Promise<{
    user: AuthPublicUser;
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await this.usersService.findUserByEmail(dto.email);

    if (user === null) {
      throw new AppException(
        HttpStatus.UNAUTHORIZED,
        '이메일 또는 비밀번호가 올바르지 않습니다.',
        'AUTH_INVALID_CREDENTIALS',
      );
    }

    if (user.provider !== AuthProvider.LOCAL || user.password === null) {
      throw new AppException(
        HttpStatus.UNAUTHORIZED,
        '이메일 또는 비밀번호가 올바르지 않습니다.',
        'AUTH_INVALID_CREDENTIALS',
      );
    }

    if (user.isBlocked) {
      throw new AppException(
        HttpStatus.FORBIDDEN,
        '차단된 계정입니다.',
        'AUTH_BLOCKED',
      );
    }

    if (user.isDeleted) {
      throw new AppException(
        HttpStatus.UNAUTHORIZED,
        '이메일 또는 비밀번호가 올바르지 않습니다.',
        'AUTH_INVALID_CREDENTIALS',
      );
    }

    const passwordOk = await bcrypt.compare(dto.password, user.password);
    if (!passwordOk) {
      throw new AppException(
        HttpStatus.UNAUTHORIZED,
        '이메일 또는 비밀번호가 올바르지 않습니다.',
        'AUTH_INVALID_CREDENTIALS',
      );
    }

    const accessPayload: JwtAccessPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      typ: JWT_ACCESS_TYP,
    };
    const accessToken = this.jwtService.sign(accessPayload, {
      expiresIn: ACCESS_JWT_EXPIRES_IN,
    });

    const refreshPayload: JwtRefreshPayload = {
      sub: user.id,
      typ: JWT_REFRESH_TYP,
    };
    const refreshToken = this.jwtService.sign(refreshPayload, {
      expiresIn: REFRESH_JWT_EXPIRES_IN,
    });

    return {
      user: this.#toPublicUser(user),
      accessToken,
      refreshToken,
    };
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

    res.cookie(ACCESS_COOKIE_NAME, accessToken, {
      ...base,
      maxAge: ACCESS_MAX_AGE_MS,
    });
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
      ...base,
      maxAge: REFRESH_MAX_AGE_MS,
    });
  }

  #toPublicUser(user: User): AuthPublicUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      profileImageUrl: user.profileImageUrl,
      isBlocked: user.isBlocked,
      isDeleted: user.isDeleted,
    };
  }
}
