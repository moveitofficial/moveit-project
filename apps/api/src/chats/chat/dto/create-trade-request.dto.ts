import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class CreateTradeRequestDto {
  @ApiProperty({ description: '협의된 서비스 금액 (원)', example: 8_500_000 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  declare agreedServicePrice: number;
}
