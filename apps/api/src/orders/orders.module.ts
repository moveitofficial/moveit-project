import { Module } from '@nestjs/common';

import { ChatModule } from '../chats/chat/chat.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PaymentsModule } from '../payments/payments.module';

import { MeOrdersController } from './me-orders.controller';
import { OrdersController } from './orders.controller';
import { OrdersCron } from './orders.cron';
import { OrdersRepository } from './orders.repository';
import { OrdersService } from './orders.service';

@Module({
  imports: [PaymentsModule, NotificationsModule, ChatModule],
  controllers: [MeOrdersController, OrdersController],
  providers: [OrdersService, OrdersRepository, OrdersCron],
  exports: [OrdersService],
})
export class OrdersModule {}
