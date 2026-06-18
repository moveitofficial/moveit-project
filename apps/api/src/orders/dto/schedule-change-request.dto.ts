import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class ScheduleChangeRequestDto {
  @ApiPropertyOptional({
    description: '채팅방 UUID. 시스템 메시지 발송에 사용됩니다.',
    format: 'uuid',
  })
  @IsUUID()
  @IsOptional()
  declare roomId?: string;
}
