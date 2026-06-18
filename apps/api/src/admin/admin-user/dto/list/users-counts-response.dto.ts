import { ApiProperty } from '@nestjs/swagger';

export class UserCounstDto {
  @ApiProperty({
    example: 302,
    description: '일반유저(CLIENT) 전체 수 (탈퇴 제외)',
  })
  declare client: number;

  @ApiProperty({
    example: 302,
    description: '판매자유저(EXPERT) 전체 수 (탈퇴 제외)',
  })
  declare expert: number;
}
