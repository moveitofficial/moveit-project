import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAccessUser } from '../auth/jwt/jwt-access.strategy';
import {
  COMMON_ERRORS,
  COMMUNITY_POST_ERRORS,
} from '../common/constants/errors';
import { ApiErrorResponse } from '../common/decorators/api-error-response.decorator';
import {
  ApiPaginatedResponse,
  ApiSuccessResponse,
} from '../common/decorators/api-success-response.decorator';
import { JwtAuth } from '../common/decorators/jwt-auth.decorator';

import { CommunityPostsService } from './community-posts.service';
import { PostListQueryDto } from './dto/post-list-query.dto';
import { PostRequestDto } from './dto/post-request.dto';
import {
  PostListItemResponseDto,
  PostResponseDto,
} from './dto/post-response.dto';

import type { Request } from 'express';

@ApiTags('community-posts')
@Controller('community-posts')
export class CommunityPostsController {
  constructor(private readonly communityPostsService: CommunityPostsService) {}

  @ApiOperation({ summary: '게시글 생성' })
  @JwtAuth()
  @ApiSuccessResponse(HttpStatus.CREATED, PostResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.VALIDATION_ERROR)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @ApiErrorResponse(
    COMMUNITY_POST_ERRORS.CONTENT_TOO_SHORT,
    COMMUNITY_POST_ERRORS.CONTENT_TOO_LONG,
  )
  @Post()
  createPost(@Req() req: Request, @Body() body: PostRequestDto) {
    const user = req.user as JwtAccessUser;
    return this.communityPostsService.createPost(user.userId, body);
  }

  @ApiOperation({ summary: '모든 게시글 조회' })
  @ApiPaginatedResponse(HttpStatus.OK, PostListItemResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.VALIDATION_ERROR)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Get()
  getAllPosts(@Query() query: PostListQueryDto) {
    return this.communityPostsService.getAllPosts(query);
  }
}
