import { Body, Controller, Get, HttpStatus, Patch, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAccessUser } from '../auth/jwt/jwt-access.strategy';
import { ClientProfilesService } from '../client-profiles/client-profiles.service';
import { ClientProfileRequestDto } from '../client-profiles/dto/client-profile-request.dto';
import { ClientProfileResponseDto } from '../client-profiles/dto/client-profile-response.dto';
import {
  CLIENT_PROFILE_ERRORS,
  COMMON_ERRORS,
  USER_ERRORS,
} from '../common/constants/errors';
import { ApiErrorResponse } from '../common/decorators/api-error-response.decorator';
import { ApiSuccessResponse } from '../common/decorators/api-success-response.decorator';
import { JwtAuth } from '../common/decorators/jwt-auth.decorator';

import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { WithdrawDataDto } from './dto/withdraw-response.dto';
import { UsersService } from './users.service';

import type { Request } from 'express';

@ApiTags('users/me')
@Controller('users/me')
export class MeController {
  constructor(
    private readonly usersService: UsersService,
    private readonly clientProfilesService: ClientProfilesService,
  ) {}

  @ApiOperation({ summary: '내 정보 조회하기' })
  @JwtAuth()
  @ApiSuccessResponse(HttpStatus.OK, UserResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.VALIDATION_ERROR)
  @ApiErrorResponse(USER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Get()
  getMe(@Req() req: Request) {
    const user = req.user as JwtAccessUser;
    return this.usersService.getUserById(user.userId);
  }

  @ApiOperation({ summary: '내 정보 수정하기' })
  @JwtAuth()
  @ApiSuccessResponse(HttpStatus.OK, UserResponseDto)
  @ApiErrorResponse(USER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Patch()
  updateMe(@Req() req: Request, @Body() dto: UpdateUserDto) {
    const user = req.user as JwtAccessUser;
    return this.usersService.updateUser(user.userId, dto);
  }

  @ApiOperation({ summary: '비밀번호 변경하기' })
  @JwtAuth()
  @ApiSuccessResponse(HttpStatus.OK)
  @ApiErrorResponse(
    COMMON_ERRORS.VALIDATION_ERROR,
    USER_ERRORS.INVALID_PASSWORD,
    USER_ERRORS.PASSWORD_MISMATCH,
  )
  @ApiErrorResponse(USER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Patch('password')
  updatePassword(@Req() req: Request, @Body() dto: UpdatePasswordDto) {
    const user = req.user as JwtAccessUser;
    return this.usersService.updatePassword(user.userId, dto);
  }

  @ApiOperation({ summary: '회원 탈퇴' })
  @JwtAuth()
  @ApiSuccessResponse(HttpStatus.OK, WithdrawDataDto)
  @ApiErrorResponse(COMMON_ERRORS.VALIDATION_ERROR)
  @ApiErrorResponse(USER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Patch('withdraw')
  withdrawMyAccount(@Req() req: Request) {
    const user = req.user as JwtAccessUser;
    return this.usersService.withdrawUser(user.userId);
  }

  @ApiOperation({ summary: '의뢰인 프로필 수정' })
  @JwtAuth()
  @ApiSuccessResponse(HttpStatus.OK, ClientProfileResponseDto)
  @ApiErrorResponse(
    COMMON_ERRORS.VALIDATION_ERROR,
    CLIENT_PROFILE_ERRORS.MIXED_SERVICE_GROUP,
  )
  @ApiErrorResponse(CLIENT_PROFILE_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Patch('client-profiles')
  updateClientProfile(
    @Req() req: Request,
    @Body() dto: ClientProfileRequestDto,
  ) {
    const user = req.user as JwtAccessUser;
    return this.clientProfilesService.updateClientProfile(user.userId, dto);
  }
}
