import { Module } from '@nestjs/common';

import { MeOrdersPaymentsController } from './me-orders-payments.controller';
import { PaymentsRepository } from './payments.repository';
import { PaymentsService } from './payments.service';

@Module({
  controllers: [MeOrdersPaymentsController],
  providers: [PaymentsService, PaymentsRepository],
  exports: [PaymentsService],
})
export class PaymentsModule {}
