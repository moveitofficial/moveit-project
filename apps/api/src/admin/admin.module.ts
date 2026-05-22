import { Module } from '@nestjs/common';

import { AdminAccountModule } from './admin-account/admin-account.module';
import { AdminAuthModule } from './admin-auth/admin-auth.module';

@Module({
  imports: [AdminAuthModule, AdminAccountModule],
})
export class AdminModule {}
