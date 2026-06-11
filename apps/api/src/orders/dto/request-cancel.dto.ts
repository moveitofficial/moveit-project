import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class RequestCancelDto {
  @ApiPropertyOptional({ example: '일정이 맞지 않아 취소 요청합니다.' })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  declare reason?: string;
}
