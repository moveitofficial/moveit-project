import { Module } from '@nestjs/common';

import { PaymentsModule } from '../payments/payments.module';

import { MeOrdersController } from './me-orders.controller';
import { OrdersController } from './orders.controller';
import { OrdersRepository } from './orders.repository';
import { OrdersService } from './orders.service';

@Module({
  imports: [PaymentsModule],
  controllers: [MeOrdersController, OrdersController],
  providers: [OrdersService, OrdersRepository],
})
export class OrdersModule {}
