import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({ example: 'Password123!' })
  @IsString()
  declare currentPassword: string;

  @ApiProperty({ example: 'NewPassword123!' })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,128}$/, {
    message:
      '비밀번호는 8자 이상이며 영문 대·소문자, 숫자, 특수문자를 각각 포함해야 합니다.',
  })
  declare newPassword: string;

  @ApiProperty({ example: 'NewPassword123!' })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,128}$/, {
    message:
      '비밀번호는 8자 이상이며 영문 대·소문자, 숫자, 특수문자를 각각 포함해야 합니다.',
  })
  declare newPasswordConfirm: string;
}
