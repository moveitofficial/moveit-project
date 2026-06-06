import { Module } from '@nestjs/common';

import { AdminOrderController } from './admin-order.controller';
import { AdminOrderRepository } from './admin-order.repository';
import { AdminOrderService } from './admin-order.service';

@Module({
  controllers: [AdminOrderController],
  providers: [AdminOrderService, AdminOrderRepository],
})
export class AdminOrderModule {}
