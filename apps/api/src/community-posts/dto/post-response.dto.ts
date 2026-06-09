import { ApiProperty, OmitType } from '@nestjs/swagger';
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

export class PostListItemResponseDto extends PostResponseDto {
  @ApiProperty({
    example: '코드잇 에이전시',
    description: '게시글 작성자 이름',
  })
  declare authorDisplayName: string;

  @ApiProperty({ example: 233 })
  declare likeCount: number;

  @ApiProperty({ example: 233 })
  declare commentCount: number;
}

export class PostDetailResponseDto extends PostListItemResponseDto {
  @ApiProperty({ example: false })
  declare isLiked: boolean;
}

export class PostDeletionResponseDto extends OmitType(PostResponseDto, [
  'category',
  'content',
] as const) {
  @ApiProperty({
    example: '2026-05-28T10:00:00.000Z',
    description: '삭제 일시',
  })
  declare deletedAt: Date;
}

export class ToggleLikeResponseDto {
  @ApiProperty({
    example: true,
    description: '좋아요 여부',
  })
  declare isLiked: boolean;
}

export class CommentResponseDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ format: 'uuid' })
  declare userId: string;

  @ApiProperty({
    example: '안녕하세요. 좋은 글 잘 봤습니다.',
    description: '댓글 내용',
  })
  declare content: string;

  @ApiProperty({ example: '2026-05-28T10:00:00.000Z' })
  declare createdAt: Date;
}

export class CommentListItemResponseDto extends CommentResponseDto {
  @ApiProperty({
    example: '코드잇',
    description: '댓글 작성자 표시 이름',
  })
  declare authorDisplayName: string;

  @ApiProperty({
    nullable: true,
    example: 'https://example.com/profile.jpg',
    description: '댓글 작성자 프로필 이미지',
  })
  declare authorProfileImageUrl: string | null;
}

export class CommentDeletionResponseDto extends OmitType(CommentResponseDto, [
  'content',
] as const) {
  @ApiProperty({
    example: '2026-05-28T10:00:00.000Z',
    description: '삭제 일시',
  })
  declare deletedAt: Date;
}
