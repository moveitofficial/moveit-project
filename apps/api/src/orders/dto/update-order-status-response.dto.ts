import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';

export class UpdateOrderStatusResponseDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ enum: OrderStatus, example: OrderStatus.WORK_COMPLETED })
  declare status: OrderStatus;

  @ApiPropertyOptional({
    nullable: true,
    example: '2026-06-15T00:00:00.000Z',
  })
  declare confirmedAt: Date | null;
}
