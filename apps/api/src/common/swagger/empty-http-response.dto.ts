import { ApiProperty } from '@nestjs/swagger';

export class EmptyDataHttpResponseDto {
  @ApiProperty({ example: true })
  declare success: boolean;

  @ApiProperty({ example: '요청 성공' })
  declare message: string;

  @ApiProperty({ example: {} })
  declare data: object;
}
