import { HttpStatus, Injectable } from '@nestjs/common';
import { AuthProvider, Prisma, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

import { AppException } from '../common/exceptions/app.exception';
import { PrismaService } from '../prisma/prisma.service';

import type { SignUpRequestDto } from './dto/sign-up-request.dto';

const BCRYPT_COST = 12;

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

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
}
