// faq-list-query.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class FaqListQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    example: '환불',
    description: '검색',
  })
  @IsOptional()
  @IsString()
  declare search: string | undefined;
}
