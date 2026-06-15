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

export class PayOrderRequestDto {
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
