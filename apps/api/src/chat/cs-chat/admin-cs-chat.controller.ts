import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { AdminJwtAccessGuard } from '../../admin/admin-auth/jwt/admin-jwt-access.guard';
import { CS_CHAT_ERRORS, COMMON_ERRORS } from '../../common/constants/errors';
import { ApiErrorResponse } from '../../common/decorators/api-error-response.decorator';
import {
  ApiPaginatedResponse,
  ApiSuccessResponse,
} from '../../common/decorators/api-success-response.decorator';
import { FindMessagesQueryDto } from '../common/dto/find-messages-query.dto';
import { FindRoomsQueryDto } from '../consultation-chat/dto/find-rooms-query.dto';

import { CsChatService } from './cs-chat.service';
import { CsMessageListResponseDto } from './dto/cs-message-response.dto';
import { CsAdminRoomResponseDto } from './dto/cs-room-response.dto';

@ApiTags('admin/cs')
@Controller('admin/cs')
export class AdminCsChatController {
  constructor(private readonly csChatService: CsChatService) {}

  @ApiOperation({ summary: 'CS 채팅방 목록 조회 (어드민)' })
  @UseGuards(AdminJwtAccessGuard)
  @ApiPaginatedResponse(HttpStatus.OK, CsAdminRoomResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Get('rooms')
  async findRooms(@Query() query: FindRoomsQueryDto) {
    return await this.csChatService.getRoomsForAdmin(query.search, query.page);
  }

  @ApiOperation({ summary: 'CS 채팅 메세지 내역 (어드민)' })
  @UseGuards(AdminJwtAccessGuard)
  @ApiSuccessResponse(HttpStatus.OK, CsMessageListResponseDto)
  @ApiErrorResponse(CS_CHAT_ERRORS.ROOM_NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Get('rooms/:id/messages')
  async findMessages(
    @Param('id') roomId: string,
    @Query() query: FindMessagesQueryDto,
  ) {
    return await this.csChatService.getMessagesForAdmin(roomId, query.cursor);
  }
}
