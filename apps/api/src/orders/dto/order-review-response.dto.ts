import { ApiProperty } from '@nestjs/swagger';

export class OrderReviewResponseDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ example: 4, description: '별점 (1~5)' })
  declare rating: number;

  @ApiProperty({
    example: 'SEO 최적화 구조와 반응형 디자인이 잘 적용되었어요.',
  })
  declare content: string;

  @ApiProperty({ type: 'string', format: 'date-time' })
  declare createdAt: Date;
}
