import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CsChatService } from './cs-chat.service';

@ApiTags('admin/cs')
@Controller('cs')
export class AdminCsChatController {
  constructor(private readonly csChatService: CsChatService) {}

  @ApiOperation({ summary: 'CS 채팅방 목록 조회 (어드민)' })
    @Get('rooms')
    findRooms() {}
}
