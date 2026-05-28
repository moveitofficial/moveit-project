import { Body, Controller, HttpStatus, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAccessUser } from '../auth/jwt/jwt-access.strategy';
import { ApiSuccessResponse } from '../common/decorators/api-success-response.decorator';
import { JwtAuth } from '../common/decorators/jwt-auth.decorator';

import { CommunityPostsService } from './community-posts.service';
import { PostRequestDto } from './dto/post-request.dto';
import { PostResponseDto } from './dto/post-response.dto';

import type { Request } from 'express';

@ApiTags('community-posts')
@Controller('communityposts')
export class CommunityPostsController {
  constructor(private readonly communityPostsService: CommunityPostsService) {}

  @ApiOperation({ summary: '게시글 생성' })
  @JwtAuth()
  @ApiSuccessResponse(HttpStatus.CREATED, PostResponseDto)
  @Post()
  createPost(@Req() req: Request, @Body() body: PostRequestDto) {
    const user = req.user as JwtAccessUser;
    return this.communityPostsService.createPost(user.userId, body);
  }
}
