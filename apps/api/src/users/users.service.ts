import { Injectable } from '@nestjs/common';
import { AuthProvider, type Role, type User } from '@prisma/client';
import bcrypt from 'bcrypt';

import { USER_ERRORS } from '../common/constants/errors';
import { AppException } from '../common/exceptions/app.exception';

import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  getAllUser() {
    return 'all user';
  }

  getUserByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  createLocalUser(params: {
    email: string;
    passwordHash: string;
    name: string;
    role: Role;
  }): Promise<User> {
    return this.usersRepository.create({
      email: params.email,
      password: params.passwordHash,
      name: params.name,
      role: params.role,
      provider: AuthProvider.LOCAL,
    });
  }

  async updateMe(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new AppException(USER_ERRORS.NOT_FOUND);
    }

    return this.usersRepository.updateById(id, dto);
  }

  async updatePassword(id: string, dto: UpdatePasswordDto): Promise<object> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new AppException(USER_ERRORS.NOT_FOUND);
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      dto.currentPassword,
      user.password ?? '',
    );
    if (!isCurrentPasswordValid) {
      throw new AppException(USER_ERRORS.INVALID_PASSWORD);
    }

    if (dto.newPassword !== dto.newPasswordConfirm) {
      throw new AppException(USER_ERRORS.PASSWORD_MISMATCH);
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 12);
    await this.usersRepository.updatePassword(id, hashedPassword);
    return {};
  }
}
