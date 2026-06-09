import { Controller, Get, HttpStatus, Param, Query, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAccessUser } from '../../auth/jwt/jwt-access.strategy';
import { CHAT_ERRORS, COMMON_ERRORS } from '../../common/constants/errors';
import { ApiErrorResponse } from '../../common/decorators/api-error-response.decorator';
import {
  ApiPaginatedResponse,
  ApiSuccessResponse,
} from '../../common/decorators/api-success-response.decorator';
import { JwtAuth } from '../../common/decorators/jwt-auth.decorator';

import { ConsultationChatService } from './consultation-chat.service';
import { ChatMessageListResponseDto } from './dto/chat-message-response.dto';
import { ChatRoomResponseDto } from './dto/chat-room-response.dto';
import { FindMessagesQueryDto } from './dto/find-messages-query.dto';
import { FindRoomsQueryDto } from './dto/find-rooms-query.dto';

import type { Request } from 'express';

@ApiTags('consultation')
@Controller('consultation')
export class ConsultationChatController {
  constructor(
    private readonly consultationChatService: ConsultationChatService,
  ) {}

  @ApiOperation({ summary: '서비스 문의 채팅방 목록 조회' })
  @JwtAuth()
  @ApiPaginatedResponse(HttpStatus.OK, ChatRoomResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Get('rooms')
  async findRooms(@Req() req: Request, @Query() query: FindRoomsQueryDto) {
    const user = req.user as JwtAccessUser;
    return await this.consultationChatService.getRooms(
      user.userId,
      query.search,
      query.page,
    );
  }

  @ApiOperation({ summary: '서비스 문의 채팅 메세지 내역' })
  @JwtAuth(CHAT_ERRORS.FORBIDDEN_NOT_PARTICIPANT)
  @ApiSuccessResponse(HttpStatus.OK, ChatMessageListResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Get('rooms/:id/messages')
  async findMessages(
    @Param('id') roomId: string,
    @Req() req: Request,
    @Query() query: FindMessagesQueryDto,
  ) {
    const user = req.user as JwtAccessUser;
    return await this.consultationChatService.getMessages(
      roomId,
      user.userId,
      query.cursor,
    );
  }
}
