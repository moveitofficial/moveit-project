import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AuthProvider, Region, Role } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty({ example: '246f7925-b83c-4b14-b34d-07009d711301' })
  declare id: string;

  @ApiProperty({ example: 'user@example.com' })
  declare email: string;

  @ApiPropertyOptional({ example: '킹한준' })
  declare name: string | null;

  @ApiProperty({ enum: Role, example: Role.CLIENT })
  declare role: Role;

  @ApiProperty({ enum: AuthProvider, example: AuthProvider.LOCAL })
  declare provider: AuthProvider;

  @ApiPropertyOptional({ example: null })
  declare providerId: string | null;

  @ApiPropertyOptional({ example: 'https://example.com/image.png' })
  declare profileImageUrl: string | null;

  @ApiPropertyOptional({ enum: Region, example: Region.SEOUL })
  declare region: Region | null;

  @ApiPropertyOptional({ example: '01012345678' })
  declare phoneNumber: string | null;

  @ApiPropertyOptional({ example: '카카오뱅크' })
  declare bankName: string | null;

  @ApiPropertyOptional({ example: '3333123456789' })
  declare bankAccount: string | null;

  @ApiProperty({ example: false })
  declare isBlocked: boolean;

  @ApiProperty({ example: false })
  declare isDeleted: boolean;

  @ApiPropertyOptional({ example: null })
  declare deletedAt: Date | null;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  declare createdAt: Date;
}

export class UserHttpResponseDto {
  @ApiProperty({ example: true })
  declare success: boolean;

  @ApiProperty({ example: '요청 성공' })
  declare message: string;

  @ApiProperty({ type: UserResponseDto })
  declare data: UserResponseDto;
}
