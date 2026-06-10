import { Module } from '@nestjs/common';

import { NotificationsModule } from '../notifications/notifications.module';
import { PaymentsModule } from '../payments/payments.module';

import { MeOrdersController } from './me-orders.controller';
import { OrdersController } from './orders.controller';
import { OrdersCron } from './orders.cron';
import { OrdersRepository } from './orders.repository';
import { OrdersService } from './orders.service';

@Module({
  imports: [PaymentsModule, NotificationsModule],
  controllers: [MeOrdersController, OrdersController],
  providers: [OrdersService, OrdersRepository, OrdersCron],
  exports: [OrdersService],
})
export class OrdersModule {}
