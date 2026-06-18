import { Module } from '@nestjs/common';

import { NotificationsModule } from '../../notifications/notifications.module';

import { AdminCommunityController } from './admin-community.controller';
import { AdminCommunityRepository } from './admin-community.repository';
import { AdminCommunityService } from './admin-community.service';

@Module({
  imports: [NotificationsModule],
  controllers: [AdminCommunityController],
  providers: [AdminCommunityService, AdminCommunityRepository],
})
export class AdminCommunityModule {}
