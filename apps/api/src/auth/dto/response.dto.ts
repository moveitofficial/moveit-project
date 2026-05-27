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

export class SignInUserDto {
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

export class SignInResponseDataDto {
  @ApiProperty({ type: SignInUserDto })
  declare user: SignInUserDto;
}
