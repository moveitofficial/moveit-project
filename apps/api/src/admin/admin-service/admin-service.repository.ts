import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

import { ORDER_TAB_STATUSES } from './dto/order-tab.enum';

import type { GetServicesQueryDto } from './dto/list/services-query.dto';
import type {
  OrderSort,
  ServiceOrdersQueryDto,
} from './dto/service-orders-query.dto';

@Injectable()
export class AdminServiceRepository {
  constructor(private readonly prisma: PrismaService) {}

  findServiceById(serviceId: string) {
    return this.prisma.service.findUnique({
      where: { id: serviceId },
      select: { id: true },
    });
  }

  findOrdersByServiceId(
    serviceId: string,
    query: ServiceOrdersQueryDto,
    skip: number,
    take: number,
  ) {
    return this.prisma.order.findMany({
      where: this.#buildWhere(serviceId, query),
      orderBy: this.#buildOrderBy(query.sort),
      skip,
      take,
      select: {
        id: true,
        status: true,
        totalAmount: true,
        startDate: true,
        endDate: true,
        clientUser: { select: { id: true, name: true } },
        service: {
          select: {
            id: true,
            title: true,
            serviceGroup: { select: { name: true } },
            serviceCategory: { select: { name: true } },
            images: {
              where: { isMain: true },
              take: 1,
              select: { imgUrl: true },
            },
          },
        },
      },
    });
  }

  countOrdersByServiceId(
    serviceId: string,
    query: ServiceOrdersQueryDto,
  ): Promise<number> {
    return this.prisma.order.count({
      where: this.#buildWhere(serviceId, query),
    });
  }

  // 탭 카운트용
  groupCountsByStatus(serviceId: string) {
    return this.prisma.order.groupBy({
      by: ['status'],
      where: { serviceId },
      _count: { _all: true },
    });
  }

  // ── private helpers ─────────────────────────────────────
  #buildWhere(
    serviceId: string,
    query: ServiceOrdersQueryDto,
  ): Prisma.OrderWhereInput {
    const { tab, search } = query;

    return {
      serviceId,
      ...(tab &&
        tab !== 'all' && {
          status: { in: ORDER_TAB_STATUSES[tab] },
        }),
      ...(search && {
        clientUser: { name: { contains: search, mode: 'insensitive' } },
      }),
    };
  }

  #buildOrderBy(
    sort: OrderSort | undefined,
  ): Prisma.OrderOrderByWithRelationInput {
    if (sort === 'endDate') {
      return { endDate: 'desc' };
    }
    return { createdAt: 'desc' };
  }

  countServices(query: GetServicesQueryDto): Promise<number> {
    return this.prisma.service.count({
      where: this.#buildServicesWhere(query),
    });
  }

  findServices(query: GetServicesQueryDto, skip: number, take: number) {
    return this.prisma.service.findMany({
      where: this.#buildServicesWhere(query),
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        servicePrice: true,
        status: true,
        createdAt: true,
        serviceGroup: { select: { name: true } },
        expertUser: {
          select: {
            expertProfile: { select: { businessName: true } },
          },
        },
        _count: { select: { orders: true } },
      },
    });
  }

  #buildServicesWhere(query: GetServicesQueryDto): Prisma.ServiceWhereInput {
    const { categoryGroup, status, search } = query;

    return {
      ...(categoryGroup && { serviceGroup: { name: categoryGroup } }),
      ...(status && { status }),
      ...(search && {
        title: { contains: search, mode: 'insensitive' },
      }),
    };
  }
}
