import { ApiPropertyOptional } from '@nestjs/swagger';
import { CommunityCategory } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export const MY_POST_SORT = ['latest', 'likes', 'comments'] as const;
export type MyPostSort = (typeof MY_POST_SORT)[number];

export class MyPostsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    enum: CommunityCategory,
    example: CommunityCategory.QUESTION,
  })
  @IsOptional()
  @IsEnum(CommunityCategory)
  declare category: CommunityCategory | undefined;

  @ApiPropertyOptional({ enum: MY_POST_SORT, example: 'latest' })
  @IsOptional()
  @IsEnum(MY_POST_SORT)
  declare sort: MyPostSort | undefined;
}
