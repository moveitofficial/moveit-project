import { Injectable } from '@nestjs/common';
import { CommunityPost } from '@prisma/client';

import { CommunityPostsRepository } from './community-posts.repository';
import { PostRequestDto } from './dto/post-request.dto';

@Injectable()
export class CommunityPostsService {
  constructor(
    private readonly communityPostsRepository: CommunityPostsRepository,
  ) {}

  createPost(userId: string, dto: PostRequestDto): Promise<CommunityPost> {
    return this.communityPostsRepository.createPost(userId, dto);
  }
}
