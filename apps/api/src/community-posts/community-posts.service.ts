import { Injectable } from '@nestjs/common';
import { CommunityPost } from '@prisma/client';

import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Paginated } from '../common/types/paginated.type';
import { toPaginatedResponse } from '../common/utils/list-response.util';

import { mapPostListItem } from './community-posts.mapper';
import { CommunityPostsRepository } from './community-posts.repository';
import { PostRequestDto } from './dto/post-request.dto';
import { PostListItemResponseDto } from './dto/post-response.dto';

@Injectable()
export class CommunityPostsService {
  constructor(
    private readonly communityPostsRepository: CommunityPostsRepository,
  ) {}

  createPost(userId: string, dto: PostRequestDto): Promise<CommunityPost> {
    return this.communityPostsRepository.createPost(userId, dto);
  }

  async getAllPosts(
    query: PaginationQueryDto,
  ): Promise<Paginated<PostListItemResponseDto>> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const skip = (page - 1) * pageSize;
    const [posts, totalCount] = await Promise.all([
      this.communityPostsRepository.findAllPosts({ skip, take: pageSize }),
      this.communityPostsRepository.countPosts(),
    ]);

    return toPaginatedResponse(
      posts.map((post) => mapPostListItem(post)),
      { page, pageSize, totalCount },
    );
  }
}
