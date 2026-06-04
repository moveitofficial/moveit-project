import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateOrderRequestDto {
  @ApiProperty({
    description: '구매할 서비스 UUID',
    example: 'd3b07384-d113-4956-a5cc-48419dd81f8c',
  })
  @IsUUID()
  declare serviceId: string;
}
