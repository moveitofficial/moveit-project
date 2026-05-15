import { Body, Controller, HttpStatus, Patch, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAccessUser } from '../auth/jwt/jwt-access.strategy';
import { COMMON_ERRORS, USER_ERRORS } from '../common/constants/errors';
import { ApiErrorResponse } from '../common/decorators/api-error-response.decorator';
import { ApiSuccessResponse } from '../common/decorators/api-success-response.decorator';
import { JwtAuth } from '../common/decorators/jwt-auth.decorator';
import { UpdatePasswordDto } from '../users/dto/update-password.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { UsersService } from '../users/users.service';

import type { Request } from 'express';

@ApiTags('me')
@Controller('me')
export class MeController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '유저 정보 수정하기' })
  @JwtAuth()
  @ApiSuccessResponse(HttpStatus.OK, UserResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.VALIDATION_ERROR)
  @ApiErrorResponse(USER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Patch()
  updateMe(@Req() req: Request, @Body() dto: UpdateUserDto) {
    const user = req.user as JwtAccessUser;
    return this.usersService.updateMe(user.userId, dto);
  }

  @ApiOperation({ summary: '비밀번호 변경하기' })
  @JwtAuth()
  @ApiSuccessResponse(HttpStatus.OK)
  @ApiErrorResponse(COMMON_ERRORS.VALIDATION_ERROR)
  @ApiErrorResponse(USER_ERRORS.INVALID_PASSWORD, USER_ERRORS.PASSWORD_MISMATCH)
  @ApiErrorResponse(USER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Patch('password')
  updatePassword(@Req() req: Request, @Body() dto: UpdatePasswordDto) {
    const user = req.user as JwtAccessUser;
    return this.usersService.updatePassword(user.userId, dto);
  }
}
