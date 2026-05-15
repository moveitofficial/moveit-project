import { ApiProperty } from '@nestjs/swagger';

class ErrorDetailDto {
  @ApiProperty({ example: 409 })
  declare code: number;
}

export class ErrorResponseDto {
  @ApiProperty({ example: false })
  declare success: boolean;

  @ApiProperty({ example: '이미 가입된 이메일입니다.' })
  declare message: string;

  @ApiProperty({ type: ErrorDetailDto })
  declare error: ErrorDetailDto;
}
