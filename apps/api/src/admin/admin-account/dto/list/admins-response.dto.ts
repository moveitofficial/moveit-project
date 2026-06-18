import { ApiProperty } from '@nestjs/swagger';

export class AdminItemDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ example: '김코딩' })
  declare name: string;

  @ApiProperty({ example: 'test@naver.com' })
  declare email: string;

  @ApiProperty({
    type: String,
    format: 'date-time',
    nullable: true,
    description: '마지막 로그인 시각 (한 번도 로그인 안 했으면 null)',
  })
  declare lastLoginAt: Date | null;

  @ApiProperty({ type: String, format: 'date-time' })
  declare createdAt: Date;
}
