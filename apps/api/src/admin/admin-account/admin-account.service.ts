import { Injectable } from '@nestjs/common';

import { AdminAccountRepository } from './admin-account.repository';

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
}
