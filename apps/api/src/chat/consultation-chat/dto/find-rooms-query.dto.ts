import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class FindRoomsQueryDto {
  @ApiPropertyOptional({
    type: String,
    example: '홍길동',
    description: '상대방 닉네임(이름) 또는 회사명 검색',
  })
  @IsOptional()
  @IsString()
  declare search: string | undefined;

  @ApiPropertyOptional({ type: Number, example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  declare page: number | undefined;
}
