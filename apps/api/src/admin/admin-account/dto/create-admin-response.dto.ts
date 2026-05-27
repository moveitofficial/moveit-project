import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminResponseDataDto {
  @ApiProperty({ format: 'uuid' })
  declare id: string;

  @ApiProperty({ example: 'newadmin@moveit.com' })
  declare email: string;

  @ApiProperty({ example: '홍길동' })
  declare name: string;

  @ApiProperty({ example: false })
  declare isSuper: boolean;

  @ApiProperty({ example: true })
  declare mustChangePassword: boolean;
}
