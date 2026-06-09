import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { COMMON_ERRORS, NOTIFICATION_ERRORS } from '../common/constants/errors';
import { ApiErrorResponse } from '../common/decorators/api-error-response.decorator';
import { ApiSuccessResponse } from '../common/decorators/api-success-response.decorator';
import { JwtAuth } from '../common/decorators/jwt-auth.decorator';
import { AppException } from '../common/exceptions/app.exception';

import { HasUnreadResponseDto } from './dto/has-unread-response.dto';
import { NotificationListResponseDto } from './dto/notification-list-response.dto';
import { NotificationsPageQueryDto } from './dto/page-query.dto';
import { NotificationsService } from './notifications.service';

import type { JwtAccessUser } from '../auth/jwt/jwt-access.strategy';
import type { Request } from 'express';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @ApiOperation({ summary: '내 알림 목록 (무한스크롤, 페이지당 10건)' })
  @JwtAuth()
  @ApiSuccessResponse(HttpStatus.OK, NotificationListResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Get()
  list(
    @Req() req: Request & { user: JwtAccessUser },
    @Query() query: NotificationsPageQueryDto,
  ): Promise<NotificationListResponseDto> {
    return this.notificationsService.list(
      req.user.userId,
      query.tab,
      query.page ?? 1,
    );
  }

  @ApiOperation({ summary: '안 읽은 알림 존재 여부 (벨 빨간 점)' })
  @JwtAuth()
  @ApiSuccessResponse(HttpStatus.OK, HasUnreadResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Get('unread')
  async hasUnread(
    @Req() req: Request & { user: JwtAccessUser },
  ): Promise<HasUnreadResponseDto> {
    const hasUnread = await this.notificationsService.hasUnread(
      req.user.userId,
    );
    return { hasUnread };
  }

  @ApiOperation({ summary: '개별 알림 읽음 처리' })
  @JwtAuth()
  @ApiSuccessResponse(HttpStatus.OK)
  @ApiErrorResponse(NOTIFICATION_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @HttpCode(HttpStatus.OK)
  @Patch(':id/read')
  markAsRead(
    @Req() req: Request & { user: JwtAccessUser },
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: () => new AppException(NOTIFICATION_ERRORS.NOT_FOUND),
      }),
    )
    id: string,
  ): Promise<void> {
    return this.notificationsService.markAsRead(id, req.user.userId);
  }

  @ApiOperation({ summary: '모든 알림 읽음 처리' })
  @JwtAuth()
  @ApiSuccessResponse(HttpStatus.OK)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @HttpCode(HttpStatus.OK)
  @Patch('read-all')
  markAllAsRead(@Req() req: Request & { user: JwtAccessUser }): Promise<void> {
    return this.notificationsService.markAllAsRead(req.user.userId);
  }

  @ApiOperation({ summary: '개별 알림 삭제 (소프트)' })
  @JwtAuth()
  @ApiSuccessResponse(HttpStatus.OK)
  @ApiErrorResponse(NOTIFICATION_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  softDelete(
    @Req() req: Request & { user: JwtAccessUser },
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: () => new AppException(NOTIFICATION_ERRORS.NOT_FOUND),
      }),
    )
    id: string,
  ): Promise<void> {
    return this.notificationsService.softDelete(id, req.user.userId);
  }

  @ApiOperation({ summary: '모든 알림 삭제 (소프트)' })
  @JwtAuth()
  @ApiSuccessResponse(HttpStatus.OK)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @HttpCode(HttpStatus.OK)
  @Delete()
  softDeleteAll(@Req() req: Request & { user: JwtAccessUser }): Promise<void> {
    return this.notificationsService.softDeleteAll(req.user.userId);
  }
}
