import { Module } from '@nestjs/common';

import { NotificationsModule } from '../../notifications/notifications.module';

import { AdminOrderController } from './admin-order.controller';
import { AdminOrderRepository } from './admin-order.repository';
import { AdminOrderService } from './admin-order.service';

@Module({
  imports: [NotificationsModule],
  controllers: [AdminOrderController],
  providers: [AdminOrderService, AdminOrderRepository],
})
export class AdminOrderModule {}
