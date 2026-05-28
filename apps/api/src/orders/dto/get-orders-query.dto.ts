import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsIn, IsOptional } from 'class-validator';

import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { ORDER_LIST_AS } from '../orders.constants';

import type { OrderListAs } from '../orders.constants';

export class GetOrdersQueryDto extends PaginationQueryDto {
  @ApiProperty({
    description: '조회 역할 (구매자: client, 판매자: expert)',
    enum: [ORDER_LIST_AS.CLIENT, ORDER_LIST_AS.EXPERT],
    example: ORDER_LIST_AS.CLIENT,
  })
  @IsIn([ORDER_LIST_AS.CLIENT, ORDER_LIST_AS.EXPERT])
  declare as: OrderListAs;

  @ApiPropertyOptional({
    description: '주문 상태 필터 (쉼표로 구분된 복수 입력 가능)',
    example: 'IN_PROGRESS,WORK_COMPLETED',
  })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' && value.length > 0
      ? value.split(',').map((s) => s.trim())
      : undefined,
  )
  @IsEnum(OrderStatus, { each: true })
  declare status?: OrderStatus[];
}
