import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class UpdateOrderScheduleRequestDto {
  @ApiProperty({
    example: '2026-06-30T00:00:00.000Z',
    description: '작업 마감일',
  })
  @IsDateString()
  declare endDate: string;
}
