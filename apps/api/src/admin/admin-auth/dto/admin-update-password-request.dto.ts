import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class AdminUpdatePasswordRequestDto {
  @ApiProperty({ example: 'TempPassword123!' })
  @IsString()
  declare currentPassword: string;

  @ApiProperty({ example: 'NewPassword123!' })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  declare newPassword: string;

  @ApiProperty({ example: 'NewPassword123!' })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  declare newPasswordConfirm: string;
}
