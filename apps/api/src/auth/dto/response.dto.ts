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

class SignInUserDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ example: 'user@example.com' })
  declare email: string;

  @ApiProperty({ nullable: true, example: '킹한준' })
  declare name: string | null;

  @ApiProperty({ enum: Role, example: Role.CLIENT })
  declare role: Role;

  @ApiProperty({ nullable: true, example: null })
  declare profileImageUrl: string | null;

  @ApiProperty({ example: false })
  declare isBlocked: boolean;

  @ApiProperty({ example: false })
  declare isDeleted: boolean;
}

class SignInResponseDataDto {
  @ApiProperty({ type: SignInUserDto })
  declare user: SignInUserDto;
}

export class signInHttpResponseDto {
  @ApiProperty({ example: true })
  declare success: boolean;

  @ApiProperty({ example: '요청 성공' })
  declare message: string;

  @ApiProperty({ type: SignInResponseDataDto })
  declare data: SignInResponseDataDto;
}
