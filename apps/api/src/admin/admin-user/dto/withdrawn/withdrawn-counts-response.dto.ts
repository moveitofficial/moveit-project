import { ApiProperty } from '@nestjs/swagger';

export class WithdrawnCountsDto {
  @ApiProperty({ example: 302, description: '탈퇴한 일반유저(CLIENT) 수' })
  declare client: number;

  @ApiProperty({ example: 47, description: '탈퇴한 판매자유저(EXPERT) 수' })
  declare expert: number;
}
