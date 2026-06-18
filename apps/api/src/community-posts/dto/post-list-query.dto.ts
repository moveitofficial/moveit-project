import { ApiPropertyOptional } from '@nestjs/swagger';
import { CommunityCategory } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class PostListQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    enum: CommunityCategory,
    description: '카테고리 필터: 생략 시 전체',
    example: CommunityCategory.QUESTION,
  })
  @IsOptional()
  @IsEnum(CommunityCategory)
  declare category?: CommunityCategory;
}
