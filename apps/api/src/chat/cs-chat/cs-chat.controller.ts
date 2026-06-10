import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SenderType } from '@prisma/client';

import { JwtAccessUser } from '../../auth/jwt/jwt-access.strategy';
import {
  CS_CHAT_ERRORS,
  COMMON_ERRORS,
  UPLOAD_ERRORS,
} from '../../common/constants/errors';
import { ApiErrorResponse } from '../../common/decorators/api-error-response.decorator';
import { ApiFileBody } from '../../common/decorators/api-file-body.decorator';
import {
  ApiPaginatedResponse,
  ApiSuccessResponse,
} from '../../common/decorators/api-success-response.decorator';
import { JwtAuth } from '../../common/decorators/jwt-auth.decorator';
import { UploadService } from '../../upload/upload.service';
import { FindMessagesQueryDto } from '../common/dto/find-messages-query.dto';

import { CsChatGateway } from './cs-chat.gateway';
import { CsChatService } from './cs-chat.service';
import { CreateCsRoomDto } from './dto/create-cs-room.dto';
import {
  CsMessageListResponseDto,
  CsMessageResponseDto,
} from './dto/cs-message-response.dto';
import { CsUserRoomResponseDto } from './dto/cs-room-response.dto';
import { FindCsRoomsQueryDto } from './dto/find-cs-rooms-query.dto';

import type { Request } from 'express';

@ApiTags('cs')
@Controller('cs')
export class CsChatController {
  constructor(
    private readonly csChatService: CsChatService,
    private readonly uploadService: UploadService,
    private readonly csChatGateway: CsChatGateway,
  ) {}

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

  @ApiOperation({
    summary: 'CS 채팅 중 파일 업로드 (1개, 500MB 이하)',
    description:
      '대화 중 파일을 업로드합니다. S3 저장, 메시지·첨부파일 DB 저장, 소켓 브로드캐스트가 한 번에 처리됩니다.',
  })
  @JwtAuth(CS_CHAT_ERRORS.FORBIDDEN)
  @ApiSuccessResponse(HttpStatus.CREATED, CsMessageResponseDto)
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
      `cs/${roomId}`,
    );
    const message = await this.csChatService.sendFileMessage(
      roomId,
      { senderType: SenderType.USER, senderUserId: user.userId },
      uploaded,
    );
    this.csChatGateway.broadcastMessage(roomId, message);
    return message;
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
