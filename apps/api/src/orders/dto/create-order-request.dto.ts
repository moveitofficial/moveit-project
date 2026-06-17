import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateOrderRequestDto {
  @ApiProperty({
    description: '구매할 서비스 UUID',
    example: 'd3b07384-d113-4956-a5cc-48419dd81f8c',
  })
  @IsUUID()
  declare serviceId: string;

  @ApiProperty({
    description:
      '결제 위젯에 전달했던 주문 UUID. 동일한 값이 우리 Order.id로 저장됩니다.',
    example: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
  })
  @IsUUID()
  declare orderId: string;

  @ApiProperty({
    description: 'Toss가 발급한 결제 고유 키',
    example: 'tgen_20260604153000',
  })
  @IsString()
  @IsNotEmpty()
  declare paymentKey: string;

  @ApiProperty({
    description: '결제 위젯에서 승인된 금액(원). 서버에서 재계산해 검증합니다.',
    example: 1_100_000,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  declare amount: number;

  @ApiPropertyOptional({
    description:
      '채팅방 UUID. 채팅 컨텍스트에서 결제 시 시스템 메시지 발송에 사용됩니다.',
    format: 'uuid',
  })
  @IsUUID()
  @IsOptional()
  declare roomId?: string;
}
