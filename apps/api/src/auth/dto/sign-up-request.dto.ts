import { ApiProperty } from '@nestjs/swagger';
import { AuthProvider, Role } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpRequestDto {
  @ApiProperty({ example: 'king@example.com' })
  @IsEmail()
  @MaxLength(320)
  declare email: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,128}$/, {
    message:
      '비밀번호는 8자 이상이며 영문 대·소문자, 숫자, 특수문자를 각각 포함해야 합니다.',
  })
  declare password: string;

  @ApiProperty({ example: '킹한준' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  declare name: string;

  @ApiProperty({ enum: Role, example: Role.CLIENT })
  @IsEnum(Role)
  declare role: Role;

  @ApiProperty({ enum: AuthProvider, example: AuthProvider.LOCAL })
  @IsEnum(AuthProvider)
  declare provider: AuthProvider;
}
