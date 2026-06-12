import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SenderType } from '@prisma/client';

import { AdminJwtAccessGuard } from '../../admin/admin-auth/jwt/admin-jwt-access.guard';
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
import { UploadService } from '../../upload/upload.service';
import { FindMessagesQueryDto } from '../common/dto/find-messages-query.dto';
import { FindRoomsQueryDto } from '../common/dto/find-rooms-query.dto';

import { CsChatGateway } from './cs-chat.gateway';
import { CsChatService } from './cs-chat.service';
import {
  CsMessageListResponseDto,
  CsMessageResponseDto,
} from './dto/cs-message-response.dto';
import { CsAdminRoomResponseDto } from './dto/cs-room-response.dto';

import type { AdminJwtAccessUser } from '../../admin/admin-auth/jwt/admin-jwt-access.strategy';
import type { Request } from 'express';

@ApiTags('admin-cs')
@Controller('admin/cs')
export class AdminCsChatController {
  constructor(
    private readonly csChatService: CsChatService,
    private readonly uploadService: UploadService,
    private readonly csChatGateway: CsChatGateway,
  ) {}

  @ApiOperation({ summary: 'CS 채팅방 목록 조회 (어드민)' })
  @UseGuards(AdminJwtAccessGuard)
  @ApiPaginatedResponse(HttpStatus.OK, CsAdminRoomResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Get('rooms')
  async findRooms(@Query() query: FindRoomsQueryDto) {
    return await this.csChatService.getRoomsForAdmin(query.search, query.page);
  }

  @ApiOperation({
    summary: 'CS 채팅 중 파일 업로드 (어드민, 1개, 500MB 이하)',
    description:
      '대화 중 파일을 업로드합니다. S3 저장, 메시지·첨부파일 DB 저장, 소켓 브로드캐스트가 한 번에 처리됩니다.',
  })
  @UseGuards(AdminJwtAccessGuard)
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
    const admin = req.user as AdminJwtAccessUser;
    const uploaded = await this.uploadService.uploadChatFile(
      file,
      `cs/${roomId}`,
    );
    const message = await this.csChatService.sendFileMessage(
      roomId,
      { senderType: SenderType.ADMIN, senderAdminId: admin.adminId },
      uploaded,
    );
    this.csChatGateway.broadcastMessage(roomId, message);
    return message;
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
