import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class PreparePaymentRequestDto {
  @ApiPropertyOptional({
    description: '결제창에 표시할 주문명. 미입력 시 서비스 제목을 사용합니다.',
    example: '웹 개발 코칭',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  declare orderName?: string;

  @ApiPropertyOptional({
    description: '결제 수단 (기본값: CARD)',
    example: 'CARD',
  })
  @IsOptional()
  @IsString()
  declare method?: string;

  @ApiPropertyOptional({
    description: '할부 개월 수 (1 = 일시불). 위젯 옵션용.',
    example: 1,
    minimum: 1,
    maximum: 12,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  declare installmentMonths?: number;
}
