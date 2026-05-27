import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';

export class UpdateOrderStatusRequestDto {
  @ApiProperty({
    description: '변경할 주문 상태',
    enum: OrderStatus,
    example: OrderStatus.IN_PROGRESS,
  })
  @IsEnum(OrderStatus)
  declare status: OrderStatus;

  @ApiProperty({
    description: 'PG사 발급 결제 고유 키 (IN_PROGRESS 전환 시 필수)',
    required: false,
    example: 'tgen_20260527_example',
  })
  @ValidateIf(
    (dto: UpdateOrderStatusRequestDto) =>
      dto.status === OrderStatus.IN_PROGRESS,
  )
  @IsString()
  @IsNotEmpty()
  declare paymentKey?: string;

  @ApiProperty({
    description:
      '클라이언트가 최종 결제 완료한 금액(원) (IN_PROGRESS 전환 시 필수)',
    required: false,
    example: 418_000,
  })
  @ValidateIf(
    (dto: UpdateOrderStatusRequestDto) =>
      dto.status === OrderStatus.IN_PROGRESS,
  )
  @IsInt()
  @Min(1)
  @Type(() => Number)
  declare paidAmount?: number;
}
