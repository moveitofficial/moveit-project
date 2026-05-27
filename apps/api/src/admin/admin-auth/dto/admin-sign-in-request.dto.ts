import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class AdminSignInRequestDto {
  @ApiProperty({
    example: 'adminUser@example.com',
    description: 'email',
    required: true,
  })
  @IsEmail()
  @MaxLength(320)
  declare email: string;

  @ApiProperty({
    example: 'password123!',
    description: 'password',
    required: true,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  declare password: string;
}
