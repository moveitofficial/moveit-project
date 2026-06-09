import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import {
  COMMENTS_ERRORS,
  COMMON_ERRORS,
  COMMUNITY_POSTS_ERRORS,
} from '../../common/constants/errors';
import { ApiErrorResponse } from '../../common/decorators/api-error-response.decorator';
import { ApiSuccessResponse } from '../../common/decorators/api-success-response.decorator';
import { AppException } from '../../common/exceptions/app.exception';
import { AdminJwtAccessGuard } from '../admin-auth/jwt/admin-jwt-access.guard';

import { AdminCommunityService } from './admin-community.service';
import { AdminDeleteRequestDto } from './dto/admin-delete-request.dto';
import { DeletionInfoResponseDto } from './dto/deletion-info-response.dto';

import type { AdminJwtAccessUser } from '../admin-auth/jwt/admin-jwt-access.strategy';
import type { Request } from 'express';

@ApiTags('admin-community')
@Controller('admin/community')
export class AdminCommunityController {
  constructor(private readonly adminCommunityService: AdminCommunityService) {}

  // ── 게시글 삭제 ──────────────────────────────────────────
  @ApiOperation({ summary: '[어드민] 게시글 삭제' })
  @ApiSuccessResponse(HttpStatus.OK)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(COMMUNITY_POSTS_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMUNITY_POSTS_ERRORS.ALREADY_DELETED)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @UseGuards(AdminJwtAccessGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('posts/:postId')
  deletePost(
    @Param(
      'postId',
      new ParseUUIDPipe({
        exceptionFactory: () =>
          new AppException(COMMUNITY_POSTS_ERRORS.NOT_FOUND),
      }),
    )
    postId: string,
    @Body() body: AdminDeleteRequestDto,
    @Req() req: Request,
  ): Promise<void> {
    const { adminId } = req.user as AdminJwtAccessUser;
    return this.adminCommunityService.deletePost(
      postId,
      adminId,
      body.deleteReason,
    );
  }

  // ── 게시글 삭제 사유 조회 ───────────────────────────────
  @ApiOperation({ summary: '[어드민] 게시글 삭제 사유 조회' })
  @ApiSuccessResponse(HttpStatus.OK, DeletionInfoResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(COMMUNITY_POSTS_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @UseGuards(AdminJwtAccessGuard)
  @Get('posts/:postId/deletion')
  getPostDeletion(
    @Param(
      'postId',
      new ParseUUIDPipe({
        exceptionFactory: () =>
          new AppException(COMMUNITY_POSTS_ERRORS.NOT_FOUND),
      }),
    )
    postId: string,
  ): Promise<DeletionInfoResponseDto> {
    return this.adminCommunityService.getPostDeletion(postId);
  }

  // ── 댓글 삭제 ────────────────────────────────────────────
  @ApiOperation({ summary: '[어드민] 댓글 삭제' })
  @ApiSuccessResponse(HttpStatus.OK)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(COMMENTS_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMENTS_ERRORS.ALREADY_DELETED)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @UseGuards(AdminJwtAccessGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('comments/:commentId')
  deleteComment(
    @Param(
      'commentId',
      new ParseUUIDPipe({
        exceptionFactory: () => new AppException(COMMENTS_ERRORS.NOT_FOUND),
      }),
    )
    commentId: string,
    @Body() body: AdminDeleteRequestDto,
    @Req() req: Request,
  ): Promise<void> {
    const { adminId } = req.user as AdminJwtAccessUser;
    return this.adminCommunityService.deleteComment(
      commentId,
      adminId,
      body.deleteReason,
    );
  }

  // ── 댓글 삭제 사유 조회 ─────────────────────────────────
  @ApiOperation({ summary: '[어드민] 댓글 삭제 사유 조회' })
  @ApiSuccessResponse(HttpStatus.OK, DeletionInfoResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(COMMENTS_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @UseGuards(AdminJwtAccessGuard)
  @Get('comments/:commentId/deletion')
  getCommentDeletion(
    @Param(
      'commentId',
      new ParseUUIDPipe({
        exceptionFactory: () => new AppException(COMMENTS_ERRORS.NOT_FOUND),
      }),
    )
    commentId: string,
  ): Promise<DeletionInfoResponseDto> {
    return this.adminCommunityService.getCommentDeletion(commentId);
  }
}
