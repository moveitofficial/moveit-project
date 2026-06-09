import { ApiProperty } from '@nestjs/swagger';

export class AdminDetailResponseDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ example: 'test@naver.com' })
  declare email: string;

  @ApiProperty({ example: '김코드' })
  declare name: string;
}
