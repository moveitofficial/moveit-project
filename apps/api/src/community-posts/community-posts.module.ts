import { Module } from '@nestjs/common';

import { NotificationsModule } from '../notifications/notifications.module';

import { CommunityPostsController } from './community-posts.controller';
import { CommunityPostsRepository } from './community-posts.repository';
import { CommunityPostsService } from './community-posts.service';

@Module({
  imports: [NotificationsModule],
  controllers: [CommunityPostsController],
  providers: [CommunityPostsService, CommunityPostsRepository],
})
export class CommunityPostsModule {}
