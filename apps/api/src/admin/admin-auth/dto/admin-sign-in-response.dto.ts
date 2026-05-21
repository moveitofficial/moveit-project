import { ApiProperty } from '@nestjs/swagger';

export class AdminSignInDataDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ example: 'admin@example.com' })
  declare email: string;

  @ApiProperty({ example: '관리자' })
  declare name: string;

  @ApiProperty({ example: false })
  declare isSuper: boolean;

  @ApiProperty({ example: true })
  declare mustChangePassword: boolean;
}

export class AdminSignInResponseDataDto {
  @ApiProperty({ type: AdminSignInDataDto })
  declare admin: AdminSignInDataDto;
}
