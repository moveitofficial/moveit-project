import { Module } from '@nestjs/common';

import { CommunityPostsController } from './community-posts.controller';
import { CommunityPostsRepository } from './community-posts.repository';
import { CommunityPostsService } from './community-posts.service';

@Module({
  controllers: [CommunityPostsController],
  providers: [CommunityPostsService, CommunityPostsRepository],
})
export class CommunityPostsModule {}
