import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateReviewRequestDto {
  @ApiProperty({
    format: 'uuid',
    description: 'order id',
  })
  @IsUUID()
  declare orderId: string;

  @ApiProperty({
    example: 5,
    minimum: 1,
    maximum: 5,
    description: 'rating',
  })
  @IsInt()
  @Min(1)
  @Max(5)
  declare rating: number;

  @ApiProperty({ example: '리뷰 내용' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  declare content: string;
}
