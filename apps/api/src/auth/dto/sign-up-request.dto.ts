import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpRequestDto {
  @ApiProperty({
    example: 'king@example.com',
    description: 'email',
    required: true,
  })
  @IsEmail()
  @MaxLength(320)
  declare email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'password',
    required: true,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,128}$/, {
    message:
      '비밀번호는 8자 이상이며 영문 대·소문자, 숫자, 특수문자를 각각 포함해야 합니다.',
  })
  declare password: string;

  @ApiPropertyOptional({
    example: '킹한준',
    description: 'name',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(50)
  declare name: string | null;

  @ApiProperty({
    enum: Role,
    example: Role.CLIENT,
    description: 'role',
    required: true,
  })
  @IsEnum(Role)
  declare role: Role;
}
