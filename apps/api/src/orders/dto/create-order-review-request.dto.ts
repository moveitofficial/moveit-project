import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateOrderReviewRequestDto {
  @ApiProperty({
    example: 5,
    minimum: 1,
    maximum: 5,
    description: 'rating',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  declare rating: number;

  @ApiProperty({ example: '리뷰 내용' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  declare content: string;
}
