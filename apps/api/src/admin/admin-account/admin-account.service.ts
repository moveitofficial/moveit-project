import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

import { AUTH_ERRORS, USER_ERRORS } from '../../common/constants/errors';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { AppException } from '../../common/exceptions/app.exception';
import { Paginated } from '../../common/types/paginated.type';
import { toPaginatedResponse } from '../../common/utils/list-response.util';
import { generateTempPassword } from '../../common/utils/password.util';
import { MailerService } from '../../mailer/mailer.service';
import { AdminActivityService } from '../admin-activity/admin-activity.service';

import { AdminAccountRepository } from './admin-account.repository';
import { CreateAdminRequestDto } from './dto/create-admin-request.dto';

import type { AdminDetailResponseDto } from './dto/admin-detail-response.dto';
import type { GetAdminsQueryDto } from './dto/list/admins-query.dto';
import type { AdminItemDto } from './dto/list/admins-response.dto';
import type { ActivityItemDto } from '../admin-activity/dto/activity-item.dto';
import type { Admin } from '@prisma/client';

@Injectable()
export class AdminAccountService {
  constructor(
    private readonly adminAccountRepository: AdminAccountRepository,
    private readonly mailerService: MailerService,
    private readonly adminActivityService: AdminActivityService,
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

  findById(id: string) {
    return this.adminAccountRepository.findById(id);
  }

  updatePassword(id: string, hashedPassword: string): Promise<void> {
    return this.adminAccountRepository.updatePassword(id, hashedPassword);
  }

  async getAdmins(query: GetAdminsQueryDto): Promise<Paginated<AdminItemDto>> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 50;
    const skip = (page - 1) * pageSize;

    const [rows, totalCount] = await Promise.all([
      this.adminAccountRepository.findAdmins(query, skip, pageSize),
      this.adminAccountRepository.countAdmins(query),
    ]);

    return toPaginatedResponse(rows, { page, pageSize, totalCount });
  }

  async getAdminDetail(id: string): Promise<AdminDetailResponseDto> {
    const admin = await this.adminAccountRepository.findAdminDetailById(id);
    if (admin === null) {
      throw new AppException(USER_ERRORS.NOT_FOUND);
    }
    return admin;
  }

  async getAdminActivities(
    id: string,
    query: PaginationQueryDto,
  ): Promise<Paginated<ActivityItemDto>> {
    const admin = await this.adminAccountRepository.findAdminDetailById(id);
    if (admin === null) {
      throw new AppException(USER_ERRORS.NOT_FOUND);
    }

    return this.adminActivityService.getActivities({
      adminId: id,
      page: query.page,
      pageSize: query.pageSize,
    });
  }
}
