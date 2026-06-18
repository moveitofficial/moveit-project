import { Module } from '@nestjs/common';

import { AdminFaqController } from './admin-faq.controller';
import { AdminFaqRepository } from './admin-faq.repository';
import { AdminFaqService } from './admin-faq.service';

@Module({
  controllers: [AdminFaqController],
  providers: [AdminFaqService, AdminFaqRepository],
})
export class AdminFaqModule {}
