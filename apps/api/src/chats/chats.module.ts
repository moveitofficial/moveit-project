import { Module } from '@nestjs/common';

import { ChatModule } from './chat/chat.module';
import { CsChatModule } from './cs-chat/cs-chat.module';

@Module({
  imports: [ChatModule, CsChatModule],
})
export class ChatsModule {}
