import { ApiProperty } from '@nestjs/swagger';

export class BlacklistCountsDto {
  @ApiProperty({ example: 12, description: '차단된 일반유저(CLIENT) 수' })
  declare client: number;

  @ApiProperty({ example: 5, description: '차단된 판매자유저(EXPERT) 수' })
  declare expert: number;
}
