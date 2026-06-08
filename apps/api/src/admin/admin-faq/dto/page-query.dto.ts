import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

// admin-faq 페이지네이션 쿼리 — page만 받음. pageSize는 서버에서 10으로 고정 (무한스크롤 호환).
export class PageQueryDto {
  @ApiPropertyOptional({ type: Number, example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  declare page: number | undefined;
}
