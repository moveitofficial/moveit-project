import { Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CsChatService } from './cs-chat.service';

@ApiTags('cs')
@Controller('cs')
export class CsChatController {
  constructor(private readonly csChatService: CsChatService) {}

  @ApiOperation({ summary: 'CS 채팅방 생성' })
  @Post('rooms')
  create() {}

  @ApiOperation({ summary: 'CS 채팅방 목록 조회 (유저)' })
  @Get('rooms')
  findRooms() {}

  @ApiOperation({ summary: 'CS 채팅 메세지 내역' })
  @Get('rooms/:id/messages')
  findMessages() {}
}
