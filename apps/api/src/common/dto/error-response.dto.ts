import { ApiProperty } from '@nestjs/swagger';

import { AUTH_ERRORS } from '../constants/errors';

class DuplicateEmailErrorDetailDto {
  @ApiProperty({ example: AUTH_ERRORS.DUPLICATE_EMAIL.code })
  declare code: string;

  @ApiProperty({ example: {} })
  declare details: Record<string, unknown>;
}

export class DuplicateEmailErrorResponseDto {
  @ApiProperty({ example: false })
  declare success: boolean;

  @ApiProperty({ example: AUTH_ERRORS.DUPLICATE_EMAIL.message })
  declare message: string;

  @ApiProperty({ type: DuplicateEmailErrorDetailDto })
  declare error: DuplicateEmailErrorDetailDto;
}

class InternalServerErrorDetailDto {
  @ApiProperty({ example: 'INTERNAL_SERVER_ERROR' })
  declare code: string;

  @ApiProperty({ example: {} })
  declare details: Record<string, unknown>;
}

export class InternalServerErrorResponseDto {
  @ApiProperty({ example: false })
  declare success: boolean;

  @ApiProperty({ example: '서버 에러..' })
  declare message: string;

  @ApiProperty({ type: InternalServerErrorDetailDto })
  declare error: InternalServerErrorDetailDto;
}
