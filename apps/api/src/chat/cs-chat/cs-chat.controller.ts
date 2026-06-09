import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAccessUser } from '../../auth/jwt/jwt-access.strategy';
import { CS_CHAT_ERRORS, COMMON_ERRORS } from '../../common/constants/errors';
import { ApiErrorResponse } from '../../common/decorators/api-error-response.decorator';
import {
  ApiPaginatedResponse,
  ApiSuccessResponse,
} from '../../common/decorators/api-success-response.decorator';
import { JwtAuth } from '../../common/decorators/jwt-auth.decorator';
import { FindMessagesQueryDto } from '../common/dto/find-messages-query.dto';

import { CsChatService } from './cs-chat.service';
import { CreateCsRoomDto } from './dto/create-cs-room.dto';
import { CsMessageListResponseDto } from './dto/cs-message-response.dto';
import { CsUserRoomResponseDto } from './dto/cs-room-response.dto';
import { FindCsRoomsQueryDto } from './dto/find-cs-rooms-query.dto';

import type { Request } from 'express';

@ApiTags('cs')
@Controller('cs')
export class CsChatController {
  constructor(private readonly csChatService: CsChatService) {}

  @ApiOperation({ summary: 'CS 채팅방 생성' })
  @JwtAuth()
  @ApiSuccessResponse(HttpStatus.CREATED, CsUserRoomResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Post('rooms')
  async create(@Req() req: Request, @Body() body: CreateCsRoomDto) {
    const user = req.user as JwtAccessUser;
    return await this.csChatService.createRoom(user.userId, body.content);
  }

  @ApiOperation({ summary: 'CS 채팅방 목록 조회 (유저)' })
  @JwtAuth()
  @ApiPaginatedResponse(HttpStatus.OK, CsUserRoomResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Get('rooms')
  async findRooms(@Req() req: Request, @Query() query: FindCsRoomsQueryDto) {
    const user = req.user as JwtAccessUser;
    return await this.csChatService.getRoomsByUser(user.userId, query.page);
  }

  @ApiOperation({ summary: 'CS 채팅 메세지 내역' })
  @JwtAuth(CS_CHAT_ERRORS.FORBIDDEN)
  @ApiSuccessResponse(HttpStatus.OK, CsMessageListResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Get('rooms/:id/messages')
  async findMessages(
    @Param('id') roomId: string,
    @Req() req: Request,
    @Query() query: FindMessagesQueryDto,
  ) {
    const user = req.user as JwtAccessUser;
    return await this.csChatService.getMessagesByUser(
      roomId,
      user.userId,
      query.cursor,
    );
  }
}
