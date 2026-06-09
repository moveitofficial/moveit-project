import { ApiProperty } from '@nestjs/swagger';
import { AuthProvider } from '@prisma/client';

export class WithdrawnItemDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ example: 'kim@naver.com' })
  declare email: string;

  @ApiProperty({
    type: String,
    nullable: true,
    example: '서비스를 더 이상 사용하지 않습니다.',
    description: '탈퇴 사유 (User.deletionReason). 미입력 시 null',
  })
  declare deletionReason: string | null;

  @ApiProperty({ enum: AuthProvider, example: AuthProvider.LOCAL })
  declare provider: AuthProvider;

  @ApiProperty({ example: '2024-04-29T05:02:46.228Z', description: '가입일' })
  declare createdAt: Date;

  @ApiProperty({ example: '2026-05-01T05:02:46.228Z', description: '탈퇴일' })
  declare deletedAt: Date;
}
