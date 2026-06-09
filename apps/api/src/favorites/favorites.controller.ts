import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { JwtAccessUser } from '../auth/jwt/jwt-access.strategy';
import {
  COMMON_ERRORS,
  EXPERT_PROFILE_ERRORS,
  FAVORITES_ERRORS,
  SERVICE_ERRORS,
  USER_ERRORS,
} from '../common/constants/errors';
import { ApiErrorResponse } from '../common/decorators/api-error-response.decorator';
import { ApiPaginatedResponse } from '../common/decorators/api-success-response.decorator';
import { RoleAuth } from '../common/decorators/jwt-auth.decorator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { ServiceListItemResponseDto } from '../services/dto/service-response.dto';

import { FavoriteExpertListItemResponseDto } from './dto/favorite-expert-list-item-response.dto';
import { FavoritesService } from './favorites.service';

import type { Request } from 'express';

@ApiTags('favorites')
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @ApiOperation({ summary: '찜한 서비스 목록' })
  @RoleAuth(Role.CLIENT)
  @ApiPaginatedResponse(HttpStatus.OK, ServiceListItemResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.VALIDATION_ERROR)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Get('services')
  getFavoriteServices(@Req() req: Request, @Query() query: PaginationQueryDto) {
    const user = req.user as JwtAccessUser;
    return this.favoritesService.getFavoriteServices(user.userId, query);
  }

  @ApiOperation({ summary: '서비스 찜' })
  @RoleAuth(Role.CLIENT)
  @ApiResponse({ status: HttpStatus.CREATED })
  @ApiErrorResponse(SERVICE_ERRORS.NOT_FOUND, SERVICE_ERRORS.NOT_AVAILABLE)
  @ApiErrorResponse(FAVORITES_ERRORS.ALREADY_FAVORITED)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Post('services/:id')
  addFavoriteService(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) serviceId: string,
  ) {
    const user = req.user as JwtAccessUser;
    return this.favoritesService.addFavoriteService(user.userId, serviceId);
  }

  @ApiOperation({ summary: '서비스 찜 해제' })
  @RoleAuth(Role.CLIENT)
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiErrorResponse(FAVORITES_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Delete('services/:id')
  removeFavoriteService(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) serviceId: string,
  ) {
    const user = req.user as JwtAccessUser;
    return this.favoritesService.removeFavoriteService(user.userId, serviceId);
  }

  @ApiOperation({ summary: '찜한 전문가 목록' })
  @RoleAuth(Role.CLIENT)
  @ApiPaginatedResponse(HttpStatus.OK, FavoriteExpertListItemResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.VALIDATION_ERROR)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Get('experts')
  getFavoriteExperts(@Req() req: Request, @Query() query: PaginationQueryDto) {
    const user = req.user as JwtAccessUser;
    return this.favoritesService.getFavoriteExperts(user.userId, query);
  }

  @ApiOperation({ summary: '전문가 찜' })
  @RoleAuth(Role.CLIENT)
  @ApiResponse({ status: HttpStatus.CREATED })
  @ApiErrorResponse(USER_ERRORS.NOT_FOUND, EXPERT_PROFILE_ERRORS.NOT_FOUND)
  @ApiErrorResponse(FAVORITES_ERRORS.ALREADY_FAVORITED)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Post('experts/:id')
  addFavoriteExpert(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) expertUserId: string,
  ) {
    const user = req.user as JwtAccessUser;
    return this.favoritesService.addFavoriteExpert(user.userId, expertUserId);
  }

  @ApiOperation({ summary: '전문가 찜 해제' })
  @RoleAuth(Role.CLIENT)
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiErrorResponse(FAVORITES_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Delete('experts/:id')
  removeFavoriteExpert(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) expertUserId: string,
  ) {
    const user = req.user as JwtAccessUser;
    return this.favoritesService.removeFavoriteExpert(
      user.userId,
      expertUserId,
    );
  }
}
