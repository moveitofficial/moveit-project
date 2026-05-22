import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateAdminRequestDto {
  @ApiProperty({ example: 'newadmin@moveit.com' })
  @IsEmail()
  @MaxLength(320)
  declare email: string;

  @ApiProperty({ example: '홍길동' })
  @IsString()
  @MaxLength(50)
  declare name: string;

  @ApiProperty({ example: 'password123!' })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  declare password: string;

  @ApiProperty({ example: 'password123!' })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  declare passwordConfirm: string;
}
