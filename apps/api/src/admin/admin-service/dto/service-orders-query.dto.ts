import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

import { ORDER_TABS, type OrderTab } from './order-tab.enum';

export const ORDER_SORTS = ['latest', 'endDate'] as const;
export type OrderSort = (typeof ORDER_SORTS)[number];

export class ServiceOrdersQueryDto {
  @ApiPropertyOptional({ enum: ORDER_TABS, default: 'all' })
  @IsOptional()
  @IsIn(ORDER_TABS)
  declare tab: OrderTab | undefined;

  @ApiPropertyOptional({
    type: String,
    example: '조한준',
    description: '구매자 이름 검색',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  declare search: string | undefined;

  @ApiPropertyOptional({ enum: ORDER_SORTS, default: 'latest' })
  @IsOptional()
  @IsIn(ORDER_SORTS)
  declare sort: OrderSort | undefined;

  @ApiPropertyOptional({ type: Number, example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  declare page: number | undefined;
}
