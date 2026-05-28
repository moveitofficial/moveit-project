import { ApiProperty } from '@nestjs/swagger';
import { CommunityCategory } from '@prisma/client';

export class PostResponseDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ format: 'uuid' })
  declare userId: string;

  @ApiProperty({ enum: CommunityCategory, example: CommunityCategory.QUESTION })
  declare category: CommunityCategory;

  @ApiProperty({ example: '이 문제 어떻게 해결하는지 아시는 분?' })
  declare title: string;

  @ApiProperty({ example: '안녕하세요. 질문 드리겠습니다. ...' })
  declare content: string;

  @ApiProperty({ example: '2026-05-28T10:00:00.000Z' })
  declare createdAt: Date;
}
