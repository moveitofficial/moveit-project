import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class FindMessagesQueryDto {
  @ApiPropertyOptional({
    type: String,
    format: 'uuid',
    description: '이전 페이지의 마지막 메시지 ID (커서)',
  })
  @IsOptional()
  @IsUUID()
  declare cursor: string | undefined;
}
