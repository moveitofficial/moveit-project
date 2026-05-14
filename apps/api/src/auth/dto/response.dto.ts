import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class SignUpResponseDataDto {
  @ApiProperty({ format: 'uuid' })
  declare userId: string;

  @ApiProperty({ enum: Role, example: Role.CLIENT })
  declare role: Role;

  @ApiProperty({ example: true })
  declare onboardingRequired: boolean;
}

export class SignUpHttpResponseDto {
  @ApiProperty({ example: true })
  declare success: boolean;

  @ApiProperty({ example: '요청 성공' })
  declare message: string;

  @ApiProperty({ type: SignUpResponseDataDto })
  declare data: SignUpResponseDataDto;
}

export class signInResponseDataDto {
  @ApiProperty({ format: 'uuid' })
  declare userId: string;

  @ApiProperty({ enum: Role, example: Role.CLIENT })
  declare role: Role;
}

export class signInHttpResponseDto {
  @ApiProperty({ example: true })
  declare success: boolean;

  @ApiProperty({ example: '로그인 성공' })
  declare message: string;

  @ApiProperty({ type: signInResponseDataDto })
  declare data: signInResponseDataDto;
}
