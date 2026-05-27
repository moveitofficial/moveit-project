import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateOrderRequestDto {
  @ApiProperty({
    description: '구매할 서비스 UUID',
    example: 'd3b07384-d113-4956-a5cc-48419dd81f8c',
  })
  @IsUUID()
  declare serviceId: string;

  @ApiProperty({
    description: '작업 시작 희망일',
    example: '2026-06-01T00:00:00.000Z',
  })
  @IsDateString()
  declare startDate: string;

  @ApiProperty({
    description: '작업 마감 희망일',
    example: '2026-06-30T00:00:00.000Z',
  })
  @IsDateString()
  declare endDate: string;

  @ApiProperty({
    description: '결제 수단',
    example: 'CARD',
  })
  @IsString()
  @IsNotEmpty()
  declare paymentMethod: string;
}
