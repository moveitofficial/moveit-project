import { Module } from '@nestjs/common';

import { AdminAccountController } from './admin-account.controller';
import { AdminAccountRepository } from './admin-account.repository';
import { AdminAccountService } from './admin-account.service';

@Module({
  providers: [AdminAccountRepository, AdminAccountService],
  exports: [AdminAccountService],
  controllers: [AdminAccountController],
})
export class AdminAccountModule {}
