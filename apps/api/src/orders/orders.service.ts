import { Injectable } from '@nestjs/common';
import { ServiceStatus } from '@prisma/client';

import { ORDER_ERRORS, SERVICE_ERRORS } from '../common/constants/errors';
import { AppException } from '../common/exceptions/app.exception';

import { CreateOrderRequestDto } from './dto/create-order-request.dto';
import { PLATFORM_FEE_RATE } from './orders.constants';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async initializeOrder(clientUserId: string, dto: CreateOrderRequestDto) {
    const service = await this.ordersRepository.findServiceById(dto.serviceId);
    if (!service) throw new AppException(SERVICE_ERRORS.NOT_FOUND);

    if (service.status !== ServiceStatus.ACTIVE) {
      throw new AppException(SERVICE_ERRORS.NOT_AVAILABLE);
    }

    if (service.expertUserId === clientUserId) {
      throw new AppException(ORDER_ERRORS.FORBIDDEN_SELF_ORDER);
    }

    const agreedServicePrice = service.servicePrice;
    const platformFee = Math.floor(agreedServicePrice * PLATFORM_FEE_RATE);
    const totalAmount = agreedServicePrice + platformFee;

    return this.ordersRepository.createPendingOrder({
      clientUserId,
      expertUserId: service.expertUserId,
      serviceId: service.id,
      agreedServicePrice,
      platformFee,
      totalAmount,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      paymentMethod: dto.paymentMethod,
    });
  }
}
