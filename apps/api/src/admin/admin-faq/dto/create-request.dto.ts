import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateFaqDto {
  @ApiProperty({
    example: '기획서나 디자인이 전혀 없는데 개발이 가능한가요?',
    description: 'FAQ 제목',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 200)
  declare title: string;

  @ApiProperty({
    example:
      '<p>네, 완벽히 가능합니다. 머릿속의 아이디어만 편하게 말씀해 주셔도 됩니다.</p>',
    description: 'FAQ 본문 (에디터 HTML, 이미지 제외)',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 10_000)
  declare content: string;
}
