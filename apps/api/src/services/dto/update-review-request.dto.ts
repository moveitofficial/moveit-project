import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateReviewRequestDto {
  @ApiPropertyOptional({
    example: 5,
    minimum: 1,
    maximum: 5,
    description: 'rating',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  declare rating: number | undefined;

  @ApiPropertyOptional({
    example: 'review content to be updated',
    description: '리뷰 수정 내용',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  declare content: string | undefined;
}
