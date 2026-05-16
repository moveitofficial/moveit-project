import { Body, Controller, HttpStatus, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAccessUser } from '../auth/jwt/jwt-access.strategy';
import {
  CLIENT_PROFILE_ERRORS,
  COMMON_ERRORS,
} from '../common/constants/errors';
import { ApiErrorResponse } from '../common/decorators/api-error-response.decorator';
import { ApiSuccessResponse } from '../common/decorators/api-success-response.decorator';
import { JwtAuth } from '../common/decorators/jwt-auth.decorator';

import { ClientProfilesService } from './client-profiles.service';
import { ClientProfileHttpResponseDto } from './dto/client-profile-response.dto';
import { CreateClientProfileDto } from './dto/create-client-profile.dto';

import type { Request } from 'express';

@ApiTags('client-profiles')
@Controller('client-profiles')
export class ClientProfilesController {
  constructor(private readonly clientProfilesService: ClientProfilesService) {}

  @ApiOperation({ summary: '의뢰인 프로필 등록' })
  @JwtAuth()
  @ApiSuccessResponse(HttpStatus.CREATED, ClientProfileHttpResponseDto)
  @ApiErrorResponse(
    COMMON_ERRORS.VALIDATION_ERROR,
    CLIENT_PROFILE_ERRORS.MIXED_SERVICE_GROUP,
  )
  @ApiErrorResponse(CLIENT_PROFILE_ERRORS.ALREADY_EXISTS)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Post()
  createClientProfile(
    @Req() req: Request,
    @Body() dto: CreateClientProfileDto,
  ) {
    const user = req.user as JwtAccessUser;
    return this.clientProfilesService.createClientProfile(user.userId, dto);
  }
}
