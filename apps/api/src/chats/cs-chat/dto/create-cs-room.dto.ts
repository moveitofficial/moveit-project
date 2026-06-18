import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateCsRoomDto {
  @ApiProperty({ example: '정산 관련 문의드립니다.' })
  @IsString()
  @MinLength(1)
  declare content: string;
}
