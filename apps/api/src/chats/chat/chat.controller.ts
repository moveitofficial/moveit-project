import { randomUUID } from 'node:crypto';

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { JwtAccessUser } from '../../auth/jwt/jwt-access.strategy';
import {
  CHAT_ERRORS,
  COMMON_ERRORS,
  ORDER_ERRORS,
  UPLOAD_ERRORS,
} from '../../common/constants/errors';
import { ApiErrorResponse } from '../../common/decorators/api-error-response.decorator';
import { ApiFileBody } from '../../common/decorators/api-file-body.decorator';
import {
  ApiPaginatedResponse,
  ApiSuccessResponse,
} from '../../common/decorators/api-success-response.decorator';
import { JwtAuth, RoleAuth } from '../../common/decorators/jwt-auth.decorator';
import { UploadChatFilesResponseDto } from '../../upload/dto/upload-chat-files-response.dto';
import { UploadService } from '../../upload/upload.service';
import { FindMessagesQueryDto } from '../common/dto/find-messages-query.dto';
import { FindRoomsQueryDto } from '../common/dto/find-rooms-query.dto';

import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import {
  ChatMessageListResponseDto,
  ChatMessageResponseDto,
} from './dto/chat-message-response.dto';
import { ChatNotificationResponseDto } from './dto/chat-notification-response.dto';
import { ChatRoomResponseDto } from './dto/chat-room-response.dto';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { CreateTradeRequestResponseDto } from './dto/create-trade-request-response.dto';
import { CreateTradeRequestDto } from './dto/create-trade-request.dto';

import type { Request } from 'express';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly uploadService: UploadService,
    private readonly chatGateway: ChatGateway,
  ) {}

  @ApiOperation({ summary: '서비스 문의 채팅방 생성 (+ 첫 메시지)' })
  @JwtAuth()
  @ApiSuccessResponse(HttpStatus.CREATED, ChatRoomResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.VALIDATION_ERROR, CHAT_ERRORS.INVALID_EXPERT)
  @ApiErrorResponse(CHAT_ERRORS.ROOM_ALREADY_EXISTS)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Post('rooms')
  async createRoom(@Req() req: Request, @Body() body: CreateChatRoomDto) {
    const user = req.user as JwtAccessUser;
    const room = await this.chatService.createRoom(user.userId, {
      expertUserId: body.expertUserId,
      serviceId: body.serviceId,
      content: body.content,
      roomId: body.roomId,
      files: body.files,
    });
    this.chatGateway.broadcastNotification(body.expertUserId, room.lastMessage);
    return room;
  }

  @ApiOperation({
    summary: '채팅방 생성 전 파일 업로드 (최대 3개, 각 500MB)',
    description:
      '채팅방 생성 전 파일을 먼저 S3에 업로드합니다. 반환된 roomId와 files를 POST /chat/rooms 요청에 포함하면 방 생성과 동시에 첨부파일이 저장됩니다.',
  })
  @JwtAuth()
  @ApiSuccessResponse(HttpStatus.CREATED, UploadChatFilesResponseDto)
  @ApiErrorResponse(
    UPLOAD_ERRORS.FILE_NOT_ATTACHED,
    UPLOAD_ERRORS.INVALID_CHAT_FILE_TYPE,
    UPLOAD_ERRORS.CHAT_FILE_TOO_LARGE,
    UPLOAD_ERRORS.CHAT_FILES_TOO_MANY,
  )
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @ApiConsumes('multipart/form-data')
  @ApiFileBody([{ name: 'files', multiple: true }])
  @UseInterceptors(FilesInterceptor('files', 3))
  @Post('rooms/new/upload')
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[] | undefined) {
    const roomId = randomUUID();
    const uploaded = await this.uploadService.uploadChatFiles(
      files,
      `chat/${roomId}`,
    );
    return { roomId, files: uploaded };
  }

  @ApiOperation({
    summary: '채팅 중 파일 업로드 (1개, 500MB 이하)',
    description:
      '대화 중 파일을 업로드합니다. S3 저장, 메시지·첨부파일 DB 저장, 소켓 브로드캐스트가 한 번에 처리됩니다.',
  })
  @JwtAuth(CHAT_ERRORS.FORBIDDEN_NOT_PARTICIPANT)
  @ApiSuccessResponse(HttpStatus.CREATED, ChatMessageResponseDto)
  @ApiErrorResponse(
    UPLOAD_ERRORS.FILE_NOT_ATTACHED,
    UPLOAD_ERRORS.INVALID_CHAT_FILE_TYPE,
    UPLOAD_ERRORS.CHAT_FILE_TOO_LARGE,
  )
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @ApiConsumes('multipart/form-data')
  @ApiFileBody('file')
  @UseInterceptors(FileInterceptor('file'))
  @Post('rooms/:id/upload')
  async uploadRoomFile(
    @Param('id') roomId: string,
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File | undefined,
  ) {
    const user = req.user as JwtAccessUser;
    const uploaded = await this.uploadService.uploadChatFile(
      file,
      `chat/${roomId}`,
    );
    const { message, receiverId } = await this.chatService.sendFileMessage(
      roomId,
      user.userId,
      uploaded,
    );
    this.chatGateway.broadcastMessage(roomId, message);
    this.chatGateway.broadcastNotification(receiverId, message);
    return message;
  }

  @ApiOperation({ summary: '서비스 문의 채팅방 목록 조회' })
  @JwtAuth()
  @ApiPaginatedResponse(HttpStatus.OK, ChatRoomResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Get('rooms')
  async findRooms(@Req() req: Request, @Query() query: FindRoomsQueryDto) {
    const user = req.user as JwtAccessUser;
    return await this.chatService.getRooms(
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
    return await this.chatService.getMessages(
      roomId,
      user.userId,
      query.cursor,
    );
  }

  @ApiOperation({ summary: '메세지 알림 목록 조회' })
  @JwtAuth()
  @ApiSuccessResponse(HttpStatus.OK, [ChatNotificationResponseDto])
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Get('notifications')
  async getNotifications(@Req() req: Request) {
    const user = req.user as JwtAccessUser;
    return await this.chatService.getNotifications(user.userId);
  }

  @ApiOperation({ summary: '채팅방 알림 삭제' })
  @JwtAuth(CHAT_ERRORS.FORBIDDEN_NOT_PARTICIPANT)
  @ApiSuccessResponse(HttpStatus.OK)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Delete('notifications/:roomId')
  async dismissNotification(
    @Param('roomId') roomId: string,
    @Req() req: Request,
  ) {
    const user = req.user as JwtAccessUser;
    await this.chatService.dismissNotification(user.userId, roomId);
    return {};
  }

  @ApiOperation({ summary: '채팅 알림 전체 삭제' })
  @JwtAuth()
  @ApiSuccessResponse(HttpStatus.OK)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Delete('notifications')
  async dismissAllNotifications(@Req() req: Request) {
    const user = req.user as JwtAccessUser;
    await this.chatService.dismissAllNotifications(user.userId);
    return {};
  }

  @ApiOperation({
    summary: '거래 요청 (전문가 → PENDING 주문 생성 + 시스템 메시지)',
  })
  @RoleAuth(Role.EXPERT, CHAT_ERRORS.FORBIDDEN_EXPERT_MISMATCH)
  @ApiSuccessResponse(HttpStatus.CREATED, CreateTradeRequestResponseDto)
  @ApiErrorResponse(CHAT_ERRORS.ROOM_NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @HttpCode(HttpStatus.CREATED)
  @Post('rooms/:id/trade-request')
  async createTradeRequest(
    @Param('id', ParseUUIDPipe) roomId: string,
    @Req() req: Request,
    @Body() body: CreateTradeRequestDto,
  ) {
    const user = req.user as JwtAccessUser;
    return this.chatService.createTradeRequest(
      roomId,
      user.userId,
      body.agreedServicePrice,
    );
  }

  @ApiOperation({
    summary: '거래 요청 취소 (전문가 → PENDING 주문 삭제 + 시스템 메시지)',
  })
  @RoleAuth(Role.EXPERT, ORDER_ERRORS.FORBIDDEN_NOT_OWNER)
  @ApiSuccessResponse(HttpStatus.OK)
  @ApiErrorResponse(ORDER_ERRORS.NOT_FOUND, ORDER_ERRORS.INVALID_STATUS)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Delete('trade-request/:orderId')
  async cancelTradeRequest(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Req() req: Request,
  ) {
    const user = req.user as JwtAccessUser;
    return this.chatService.cancelTradeRequest(orderId, user.userId);
  }
}
