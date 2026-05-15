import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class OAuthSignUpRequestDto {
  @ApiProperty({
    description: 'OAuth 콜백 후 발급된 signupToken',
    required: true,
  })
  @IsString()
  declare signupToken: string;

  @ApiProperty({
    enum: Role,
    example: Role.CLIENT,
    description: 'role',
    required: true,
  })
  @IsEnum(Role)
  declare role: Role;
}
