import { Module } from '@nestjs/common';

import { AdminAccountModule } from './admin-account/admin-account.module';
import { AdminAuthModule } from './admin-auth/admin-auth.module';
import { AdminDashboardModule } from './admin-dashboard/admin-dashboard.module';
import { AdminUserModule } from './admin-user/admin-user.module';

@Module({
  imports: [
    AdminAuthModule,
    AdminAccountModule,
    AdminDashboardModule,
    AdminUserModule,
  ],
})
export class AdminModule {}
