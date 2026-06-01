import { Module } from '@nestjs/common';

import { PaymentsRepository } from './payments.repository';
import { PaymentsService } from './payments.service';

@Module({
  providers: [PaymentsService, PaymentsRepository],
  exports: [PaymentsService],
})
export class PaymentsModule {}
