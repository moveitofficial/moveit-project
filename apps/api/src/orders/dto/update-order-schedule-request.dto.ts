import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsUUID } from 'class-validator';

export class UpdateOrderScheduleRequestDto {
  @ApiProperty({
    example: '2026-06-30T00:00:00.000Z',
    description: '작업 마감일',
  })
  @IsDateString()
  declare endDate: string;

  @ApiPropertyOptional({
    description: '채팅방 UUID. 시스템 메시지 발송에 사용됩니다.',
    format: 'uuid',
  })
  @IsUUID()
  @IsOptional()
  declare roomId?: string;
}
