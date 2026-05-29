import { ApiProperty } from '@nestjs/swagger';
import { CommunityCategory } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';

export class PostRequestDto {
  @ApiProperty({ example: CommunityCategory.QUESTION })
  @IsEnum(CommunityCategory)
  @IsNotEmpty()
  declare category: CommunityCategory;

  @ApiProperty({
    example: '이 문제 어떻게 해결하는지 아시는 분?',
    description: '게시글 제목',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  declare title: string;

  @ApiProperty({
    example: '안녕하세요. 질문 드리겠습니다. ...',
    description: '게시글 내용',
  })
  @IsString()
  @IsNotEmpty()
  declare content: string;
}
