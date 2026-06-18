import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export const MY_REVIEW_SORT = ['latest', 'oldest'] as const;

export type MyReviewSort = (typeof MY_REVIEW_SORT)[number];

export class MyReviewsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: MY_REVIEW_SORT, example: 'latest' })
  @IsOptional()
  @IsEnum(MY_REVIEW_SORT)
  declare sort: MyReviewSort | undefined;
}
