import { Module } from '@nestjs/common';

import { AdminAccountModule } from './admin-account/admin-account.module';
import { AdminAuthModule } from './admin-auth/admin-auth.module';
import { AdminCategoryFeaturedModule } from './admin-category-featured/admin-category-featured.module';
import { AdminCommunityModule } from './admin-community/admin-community.module';
import { AdminDashboardModule } from './admin-dashboard/admin-dashboard.module';
import { AdminFaqModule } from './admin-faq/admin-faq.module';
import { AdminMainSettingModule } from './admin-main-setting/admin-main-setting.module';
import { AdminOrderModule } from './admin-order/admin-order.module';
import { AdminReportModule } from './admin-report/admin-report.module';
import { AdminServiceModule } from './admin-service/admin-service.module';
import { AdminUserModule } from './admin-user/admin-user.module';

@Module({
  imports: [
    AdminAuthModule,
    AdminAccountModule,
    AdminDashboardModule,
    AdminUserModule,
    AdminReportModule,
    AdminCommunityModule,
    AdminServiceModule,
    AdminOrderModule,
    AdminMainSettingModule,
    AdminCategoryFeaturedModule,
    AdminFaqModule,
  ],
})
export class AdminModule {}
