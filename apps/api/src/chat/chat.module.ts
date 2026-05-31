import { Module } from '@nestjs/common';

import { ConsultationChatModule } from './consultation-chat/consultation-chat.module';
import { CustomerSupportModule } from './customer-support/customer-support.module';

@Module({
  imports: [ConsultationChatModule, CustomerSupportModule],
})
export class ChatModule {}
