import { Module } from '@nestjs/common';

import { ConsultationChatModule } from './consultation-chat/consultation-chat.module';
import { CsChatModule } from './cs-chat/cs-chat.module';

@Module({
  imports: [ConsultationChatModule, CsChatModule],
})
export class ChatModule {}
