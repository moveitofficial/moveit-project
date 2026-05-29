import { Injectable } from '@nestjs/common';

import { Paginated } from '../common/types/paginated.type';
import { toPaginatedResponse } from '../common/utils/list-response.util';

import { mapPost, mapPostListItem } from './community-posts.mapper';
import { CommunityPostsRepository } from './community-posts.repository';
import { PostListQueryDto } from './dto/post-list-query.dto';
import { PostRequestDto } from './dto/post-request.dto';
import { PostListItemResponseDto } from './dto/post-response.dto';

@Injectable()
export class CommunityPostsService {
  constructor(
    private readonly communityPostsRepository: CommunityPostsRepository,
  ) {}

  async createPost(
    userId: string,
    dto: PostRequestDto,
  ): Promise<ReturnType<typeof mapPost>> {
    const created = await this.communityPostsRepository.createPost(userId, dto);

    return mapPost(created);
  }

  async getAllPosts(
    query: PostListQueryDto,
  ): Promise<Paginated<PostListItemResponseDto>> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const skip = (page - 1) * pageSize;
    const category = query.category;
    const [posts, totalCount] = await Promise.all([
      this.communityPostsRepository.findAllPosts({
        skip,
        take: pageSize,
        category,
      }),
      this.communityPostsRepository.countPosts(category),
    ]);
    return toPaginatedResponse(
      posts.map((post) => mapPostListItem(post)),
      { page, pageSize, totalCount },
    );
  }
}
