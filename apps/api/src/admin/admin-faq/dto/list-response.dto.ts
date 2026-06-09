import { ApiProperty } from '@nestjs/swagger';

export class FaqListItemDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ example: '기획서나 디자인이 전혀 없는데 개발이 가능한가요?' })
  declare title: string;

  @ApiProperty({
    example:
      '<p>네, 완벽히 가능합니다. 머릿속의 아이디어만 편하게 말씀해 주셔도 됩니다.</p>',
    description: 'FAQ 본문 (에디터 HTML, 아코디언 펼침에 그대로 사용)',
  })
  declare content: string;

  @ApiProperty({ type: String, format: 'date-time' })
  declare createdAt: Date;
}
