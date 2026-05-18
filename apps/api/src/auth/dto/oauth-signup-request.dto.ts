import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class OAuthSignUpRequestDto {
  @ApiProperty({
    enum: Role,
    example: Role.CLIENT,
    description: 'role',
    required: true,
  })
  @IsEnum(Role)
  declare role: Role;
}
