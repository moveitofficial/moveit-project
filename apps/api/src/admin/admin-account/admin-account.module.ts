import { Module } from '@nestjs/common';

import { AdminActivityModule } from '../admin-activity/admin-activity.module';

import { AdminAccountController } from './admin-account.controller';
import { AdminAccountRepository } from './admin-account.repository';
import { AdminAccountService } from './admin-account.service';

@Module({
  imports: [AdminActivityModule],
  providers: [AdminAccountRepository, AdminAccountService],
  exports: [AdminAccountService],
  controllers: [AdminAccountController],
})
export class AdminAccountModule {}
