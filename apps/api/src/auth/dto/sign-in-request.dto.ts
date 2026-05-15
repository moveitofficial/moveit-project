import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class SignInRequestDto {
  @ApiProperty({
    example: 'user@example.com',
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
  declare password: string;
}
