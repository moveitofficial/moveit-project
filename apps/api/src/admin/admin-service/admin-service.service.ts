import { Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';

import { SERVICE_ERRORS } from '../../common/constants/errors';
import { AppException } from '../../common/exceptions/app.exception';

import { AdminServiceRepository } from './admin-service.repository';
import { ORDER_TAB_STATUSES } from './dto/order-tab.enum';
import {
  type ServiceOrderCountsDto,
  type ServiceOrdersResponseDto,
} from './dto/service-orders-response.dto';

import type { ServiceOrdersQueryDto } from './dto/service-orders-query.dto';

const PAGE_SIZE = 5;

@Injectable()
export class AdminServiceService {
  constructor(
    private readonly adminServiceRepository: AdminServiceRepository,
  ) {}

  async getServiceOrders(
    serviceId: string,
    query: ServiceOrdersQueryDto,
  ): Promise<ServiceOrdersResponseDto> {
    const service =
      await this.adminServiceRepository.findServiceById(serviceId);
    if (!service) throw new AppException(SERVICE_ERRORS.NOT_FOUND);

    const page = query.page ?? 1;
    const skip = (page - 1) * PAGE_SIZE;

    const [rows, totalCount] = await Promise.all([
      this.adminServiceRepository.findOrdersByServiceId(
        serviceId,
        query,
        skip,
        PAGE_SIZE,
      ),
      this.adminServiceRepository.countOrdersByServiceId(serviceId, query),
    ]);

    const items = rows.map((o) => ({
      id: o.id,
      status: o.status,
      totalAmount: o.totalAmount,
      startDate: o.startDate,
      endDate: o.endDate,
      client: { id: o.clientUser.id, name: o.clientUser.name },
      service: {
        id: o.service.id,
        title: o.service.title,
        serviceGroupName: o.service.serviceGroup.name,
        serviceCategoryName: o.service.serviceCategory.name,
        thumbnailUrl: o.service.images[0]?.imgUrl ?? null,
      },
    }));

    return {
      items,
      page,
      pageSize: PAGE_SIZE,
      totalCount,
      hasNext: skip + rows.length < totalCount,
    };
  }

  async getServiceOrderCounts(
    serviceId: string,
  ): Promise<ServiceOrderCountsDto> {
    const service =
      await this.adminServiceRepository.findServiceById(serviceId);
    if (!service) throw new AppException(SERVICE_ERRORS.NOT_FOUND);

    const statusGroups =
      await this.adminServiceRepository.groupCountsByStatus(serviceId);
    return this.#buildCounts(statusGroups);
  }

  // groupBy 결과를 탭별 카운트로 집계
  #buildCounts(
    statusGroups: { status: OrderStatus; _count: { _all: number } }[],
  ): ServiceOrderCountsDto {
    const byStatus = new Map<OrderStatus, number>(
      statusGroups.map((g) => [g.status, g._count._all]),
    );

    const sumOf = (statuses: OrderStatus[]) =>
      statuses.reduce((acc, s) => acc + (byStatus.get(s) ?? 0), 0);

    return {
      all: sumOf([...byStatus.keys()]),
      working: sumOf(ORDER_TAB_STATUSES.working),
      workCompleted: sumOf(ORDER_TAB_STATUSES.workCompleted),
      purchaseConfirmed: sumOf(ORDER_TAB_STATUSES.purchaseConfirmed),
      settlement: sumOf(ORDER_TAB_STATUSES.settlement),
      expired: sumOf(ORDER_TAB_STATUSES.expired),
      cancelRefund: sumOf(ORDER_TAB_STATUSES.cancelRefund),
    };
  }
}
