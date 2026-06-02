import { Controller, Get, Param, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAccessUser } from '../../auth/jwt/jwt-access.strategy';
import { JwtAuth } from '../../common/decorators/jwt-auth.decorator';

import { ConsultationChatService } from './consultation-chat.service';

import type { Request } from 'express';

@ApiTags('consultation')
@Controller('consultation')
export class ConsultationChatController {
  constructor(
    private readonly consultationChatService: ConsultationChatService,
  ) {}

  @ApiOperation({ summary: '서비스 문의 채팅방 목록 조회' })
  @JwtAuth()
  @Get('rooms')
  async findRooms(@Req() req: Request) {
    const user = req.user as JwtAccessUser;
    return await this.consultationChatService.getRooms(user.userId);
  }

  @ApiOperation({ summary: '서비스 문의 채팅 메세지 내역' })
  @JwtAuth()
  @Get('rooms/:id/messages')
  async findMessages(@Param('id') roomId: string, @Req() req: Request) {
    const user = req.user as JwtAccessUser;
    return await this.consultationChatService.getMessages(roomId, user.userId);
  }
}
