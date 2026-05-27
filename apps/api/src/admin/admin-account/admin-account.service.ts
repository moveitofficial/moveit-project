import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

import { AUTH_ERRORS, USER_ERRORS } from '../../common/constants/errors';
import { AppException } from '../../common/exceptions/app.exception';
import { generateTempPassword } from '../../common/utils/password.util';
import { MailerService } from '../../mailer/mailer.service';

import { AdminAccountRepository } from './admin-account.repository';
import { CreateAdminRequestDto } from './dto/create-admin-request.dto';

import type { Admin } from '@prisma/client';

@Injectable()
export class AdminAccountService {
  constructor(
    private readonly adminAccountRepository: AdminAccountRepository,
    private readonly mailerService: MailerService,
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

  async resetPasswordById(adminId: string): Promise<void> {
    const admin = await this.adminAccountRepository.findById(adminId);
    if (admin === null) {
      throw new AppException(USER_ERRORS.NOT_FOUND);
    }

    const tempPassword = generateTempPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 12);

    await this.adminAccountRepository.resetPassword(adminId, hashedPassword);

    await this.mailerService.sendMail({
      to: admin.email,
      subject: '[Moveit] 관리자 비밀번호가 초기화되었습니다',
      text:
        `임시 비밀번호: ${tempPassword}\n\n` +
        `로그인 후 즉시 비밀번호를 변경해주세요.`,
    });
  }
}
