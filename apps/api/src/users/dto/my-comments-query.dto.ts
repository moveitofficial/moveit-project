import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export const MY_COMMENT_SORT = ['latest', 'oldest'] as const;
export type MyCommentSort = (typeof MY_COMMENT_SORT)[number];

export class MyCommentsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: MY_COMMENT_SORT, example: 'latest' })
  @IsOptional()
  @IsEnum(MY_COMMENT_SORT)
  declare sort: MyCommentSort | undefined;
}
