import { Module } from '@nestjs/common';

import { AdminAccountRepository } from './admin-account.repository';
import { AdminAccountService } from './admin-account.service';

@Module({
  providers: [AdminAccountRepository, AdminAccountService],
  exports: [AdminAccountService],
})
export class AdminAccountModule {}
