import { Module } from '@nestjs/common';

import { NotificationsModule } from '../../notifications/notifications.module';

import { AdminUserController } from './admin-user.controller';
import { AdminUserRepository } from './admin-user.repository';
import { AdminUserService } from './admin-user.service';

@Module({
  imports: [NotificationsModule],
  controllers: [AdminUserController],
  providers: [AdminUserService, AdminUserRepository],
})
export class AdminUserModule {}
