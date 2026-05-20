import { randomUUID } from 'node:crypto';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthProvider, Prisma, Role, type User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { TokenExpiredError } from 'jsonwebtoken';

import {
  AUTH_ERRORS,
  COMMON_ERRORS,
  OAUTH_ERRORS,
  USER_ERRORS,
} from '../common/constants/errors';
import { AppException } from '../common/exceptions/app.exception';
import { UsersService } from '../users/users.service';

import {
  ACCESS_COOKIE_NAME,
  ACCESS_JWT_EXPIRES_IN,
  ACCESS_MAX_AGE_MS,
  JWT_ACCESS_TYP,
  JWT_OAUTH_SIGNUP_TYP,
  JWT_OAUTH_STATE_TYP,
  JWT_REFRESH_TYP,
  OAUTH_SIGNUP_COOKIE_MAX_AGE_MS,
  OAUTH_SIGNUP_COOKIE_NAME,
  OAUTH_SIGNUP_JWT_EXPIRES_IN,
  OAUTH_STATE_JWT_EXPIRES_IN,
  REFRESH_COOKIE_NAME,
  REFRESH_JWT_EXPIRES_IN,
  REFRESH_MAX_AGE_MS,
} from './auth.constants';

import type {
  AuthPublicUser,
  JwtAccessPayload,
  JwtOAuthSignupPayload,
  JwtOAuthStatePayload,
  JwtRefreshPayload,
  OAuthCallbackResult,
} from './auth.types';
import type { SignInRequestDto } from './dto/sign-in-request.dto';
import type { SignUpRequestDto } from './dto/sign-up-request.dto';
import type { OAuthProfile } from './oauth/oauth.types';
import type { Response } from 'express';

const BCRYPT_COST = 12;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async signUpWithEmail(dto: SignUpRequestDto): Promise<{
    userId: string;
    role: Role;
    onboardingRequired: boolean;
  }> {
    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_COST);

    try {
      const user = await this.usersService.createLocalUser({
        email: dto.email,
        passwordHash,
        name: dto.name,
        role: dto.role,
      });

      return {
        userId: user.id,
        role: user.role,
        onboardingRequired: true,
      };
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new AppException(AUTH_ERRORS.DUPLICATE_EMAIL);
      }

      throw error;
    }
  }

  async signInWithEmail(dto: SignInRequestDto): Promise<{
    user: AuthPublicUser;
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await this.usersService.getUserByEmail(dto.email);

    if (user === null) {
      throw new AppException(USER_ERRORS.NOT_FOUND);
    }

    if (user.provider !== AuthProvider.LOCAL || user.password === null) {
      throw new AppException(AUTH_ERRORS.INVALID_CREDENTIALS);
    }

    this.#ensureUserCanLogin(user);

    const passwordOk = await bcrypt.compare(dto.password, user.password);
    if (!passwordOk) {
      throw new AppException(AUTH_ERRORS.INVALID_CREDENTIALS);
    }

    const { accessToken, refreshToken } = this.#issueTokensForUser(user);

    return {
      user: this.#toPublicUser(user),
      accessToken,
      refreshToken,
    };
  }

  async handleOAuthCallback(
    profile: OAuthProfile,
  ): Promise<OAuthCallbackResult> {
    const existing = await this.usersService.getUserByProviderId(
      profile.provider,
      profile.providerId,
    );

    if (existing !== null) {
      this.#ensureUserCanLogin(existing);
      const { accessToken, refreshToken } = this.#issueTokensForUser(existing);
      return { kind: 'login', accessToken, refreshToken };
    }

    const emailUser = await this.usersService.getUserByEmail(profile.email);
    if (emailUser !== null) {
      throw new AppException(OAUTH_ERRORS.OAUTH_DUPLICATE_EMAIL);
    }

    const signupToken = this.#issueSignupToken(profile);
    return { kind: 'signup_pending', signupToken };
  }

  async completeOAuthSignup(
    signupToken: string | undefined,
    role: Role,
  ): Promise<{
    user: AuthPublicUser;
    accessToken: string;
    refreshToken: string;
  }> {
    const pending = this.#parseSignupToken(signupToken);

    const profile: OAuthProfile = {
      provider: pending.provider,
      providerId: pending.providerId,
      email: pending.email,
      name: pending.name,
      profileImageUrl: pending.profileImageUrl,
    };

    let user = await this.usersService.getUserByProviderId(
      profile.provider,
      profile.providerId,
    );

    if (user === null) {
      const emailUser = await this.usersService.getUserByEmail(profile.email);
      if (emailUser !== null) {
        throw new AppException(OAUTH_ERRORS.OAUTH_DUPLICATE_EMAIL);
      }

      try {
        user = await this.usersService.createOAuthUser(profile, role);
      } catch (error: unknown) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          throw new AppException(OAUTH_ERRORS.OAUTH_DUPLICATE_EMAIL);
        }
        throw error;
      }
    }

    this.#ensureUserCanLogin(user);
    const { accessToken, refreshToken } = this.#issueTokensForUser(user);

    return {
      user: this.#toPublicUser(user),
      accessToken,
      refreshToken,
    };
  }

  createOAuthState(): string {
    const payload: JwtOAuthStatePayload = {
      nonce: randomUUID(),
      typ: JWT_OAUTH_STATE_TYP,
    };
    return this.jwtService.sign(payload, {
      expiresIn: OAUTH_STATE_JWT_EXPIRES_IN,
    });
  }

  parseOAuthState(state: string | undefined): void {
    if (state === undefined || state === '') {
      throw new UnauthorizedException();
    }

    try {
      const payload = this.jwtService.verify<JwtOAuthStatePayload>(state);
      if (payload.typ !== JWT_OAUTH_STATE_TYP) {
        throw new UnauthorizedException();
      }
    } catch (error: unknown) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException();
    }
  }

  getOAuthSuccessRedirectUrl(): string {
    return this.config.getOrThrow<string>('OAUTH_SUCCESS_REDIRECT_URL');
  }

  getOAuthSignupRedirectUrl(): string {
    return this.config.getOrThrow<string>('OAUTH_SIGNUP_REDIRECT_URL');
  }

  getOAuthFailureRedirectUrl(err: unknown): string {
    const base = this.config.getOrThrow<string>('OAUTH_FAILURE_REDIRECT_URL');
    const code =
      err instanceof AppException && err.code ? err.code : 'AUTH_OAUTH_FAILED';
    const url = new URL(base);
    url.searchParams.set('code', code);
    return url.toString();
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

  async refreshAccessToken(userId: string): Promise<{
    user: AuthPublicUser;
    accessToken: string;
  }> {
    const user = await this.usersService.findUserById(userId);

    if (user === null) {
      throw new AppException(AUTH_ERRORS.REFRESH_TOKEN_INVALID);
    }

    const accessToken = this.#issueAccessTokenForUser(user);

    return {
      user: this.#toPublicUser(user),
      accessToken,
    };
  }

  setAccessCookie(res: Response, accessToken: string): void {
    const secure = this.config.get<string>('NODE_ENV') === 'production';
    res.cookie(ACCESS_COOKIE_NAME, accessToken, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      path: '/',
      maxAge: ACCESS_MAX_AGE_MS,
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

    res.clearCookie(ACCESS_COOKIE_NAME, base);
    res.clearCookie(REFRESH_COOKIE_NAME, base);
  }

  setOAuthSignupCookie(res: Response, signupToken: string): void {
    const secure = this.config.get<string>('NODE_ENV') === 'production';
    res.cookie(OAUTH_SIGNUP_COOKIE_NAME, signupToken, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      path: '/auth/oauth/signup',
      maxAge: OAUTH_SIGNUP_COOKIE_MAX_AGE_MS,
    });
  }

  clearOAuthSignupCookie(res: Response): void {
    const secure = this.config.get<string>('NODE_ENV') === 'production';
    res.clearCookie(OAUTH_SIGNUP_COOKIE_NAME, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      path: '/auth/oauth/signup',
    });
  }

  #issueSignupToken(profile: OAuthProfile): string {
    const payload: JwtOAuthSignupPayload = {
      typ: JWT_OAUTH_SIGNUP_TYP,
      provider: profile.provider,
      providerId: profile.providerId,
      email: profile.email,
      name: profile.name,
      profileImageUrl: profile.profileImageUrl ?? null,
    };
    return this.jwtService.sign(payload, {
      expiresIn: OAUTH_SIGNUP_JWT_EXPIRES_IN,
    });
  }

  #parseSignupToken(token: string | undefined): JwtOAuthSignupPayload {
    if (token === undefined || token === '') {
      throw new AppException(OAUTH_ERRORS.OAUTH_SIGNUP_TOKEN_INVALID);
    }

    try {
      const payload = this.jwtService.verify<JwtOAuthSignupPayload>(token);
      if (payload.typ !== JWT_OAUTH_SIGNUP_TYP) {
        throw new AppException(OAUTH_ERRORS.OAUTH_SIGNUP_TOKEN_INVALID);
      }
      return payload;
    } catch (error: unknown) {
      if (error instanceof AppException) throw error;
      if (error instanceof TokenExpiredError) {
        throw new AppException(OAUTH_ERRORS.OAUTH_SIGNUP_TOKEN_EXPIRED);
      }
      throw new AppException(OAUTH_ERRORS.OAUTH_SIGNUP_TOKEN_INVALID);
    }
  }

  #issueAccessTokenForUser(user: User): string {
    const accessPayload: JwtAccessPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      typ: JWT_ACCESS_TYP,
    };
    return this.jwtService.sign(accessPayload, {
      expiresIn: ACCESS_JWT_EXPIRES_IN,
    });
  }

  #issueTokensForUser(user: User): {
    accessToken: string;
    refreshToken: string;
  } {
    const accessToken = this.#issueAccessTokenForUser(user);

    const refreshPayload: JwtRefreshPayload = {
      sub: user.id,
      typ: JWT_REFRESH_TYP,
    };
    const refreshToken = this.jwtService.sign(refreshPayload, {
      expiresIn: REFRESH_JWT_EXPIRES_IN,
    });

    return { accessToken, refreshToken };
  }

  #ensureUserCanLogin(user: User): void {
    if (user.isBlocked) {
      throw new AppException(COMMON_ERRORS.BLOCKED);
    }
    if (user.isDeleted) {
      throw new AppException(USER_ERRORS.DELETED);
    }
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
