import { Injectable } from '@nestjs/common';

import { ConsultationChatRepository } from './consultation-chat.repository';

@Injectable()
export class ConsultationChatService {
  constructor(private readonly repo: ConsultationChatRepository) {}
}
