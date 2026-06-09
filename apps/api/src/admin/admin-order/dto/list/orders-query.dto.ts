import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

import { ORDER_TABS, type OrderTab } from './orders-tab.enum';

export const ORDER_SORTS = ['latest', 'deadline'] as const;
export type OrderSort = (typeof ORDER_SORTS)[number];

export class GetOrdersQueryDto {
  @ApiPropertyOptional({
    enum: ORDER_TABS,
    example: 'all',
    default: 'all',
    description: '탭 필터. 기본 all (전체)',
  })
  @IsOptional()
  @IsIn(ORDER_TABS)
  declare tab: OrderTab | undefined;

  @ApiPropertyOptional({
    enum: ORDER_SORTS,
    example: 'latest',
    default: 'latest',
    description:
      'latest=최신순(createdAt desc) / deadline=마감일 순(endDate asc, null 마지막)',
  })
  @IsOptional()
  @IsIn(ORDER_SORTS)
  declare sort: OrderSort | undefined;

  @ApiPropertyOptional({
    type: String,
    example: '조한준',
    description: '구매자 이름 + 판매자 회사명 OR 부분 일치 (대소문자 무시)',
  })
  @IsOptional()
  @IsString()
  declare search: string | undefined;

  @ApiPropertyOptional({ type: Number, example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  declare page: number | undefined;

  @ApiPropertyOptional({ type: Number, example: 50, default: 50, maximum: 500 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(500)
  declare pageSize: number | undefined;
}
