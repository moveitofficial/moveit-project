import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

import { AUTH_ERRORS, USER_ERRORS } from '../../common/constants/errors';
import { AppException } from '../../common/exceptions/app.exception';

import { AdminAccountRepository } from './admin-account.repository';
import { CreateAdminRequestDto } from './dto/create-admin-request.dto';

import type { Admin } from '@prisma/client';

@Injectable()
export class AdminAccountService {
  constructor(
    private readonly adminAccountRepository: AdminAccountRepository,
  ) {}

  getAdminByEmail(email: string): Promise<Admin | null> {
    return this.adminAccountRepository.findByEmail(email);
  }

  updateLastLoginAt(id: string): Promise<void> {
    return this.adminAccountRepository.updateLastLoginAt(id);
  }

  async createAdmin(dto: CreateAdminRequestDto): Promise<Admin> {
    if (dto.password !== dto.passwordConfirm) {
      throw new AppException(USER_ERRORS.PASSWORD_MISMATCH);
    }
    const existing = await this.adminAccountRepository.findByEmail(dto.email);
    if (existing !== null) {
      throw new AppException(AUTH_ERRORS.DUPLICATE_EMAIL);
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    return this.adminAccountRepository.create({
      email: dto.email,
      name: dto.name,
      password: passwordHash,
    });
  }
}
