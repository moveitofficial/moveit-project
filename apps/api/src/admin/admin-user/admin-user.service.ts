import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';

import { Paginated } from '../../common/types/paginated.type';
import { toPaginatedResponse } from '../../common/utils/list-response.util';

import { AdminUserRepository } from './admin-user.repository';
import { UserCounstDto } from './dto/users-counts-response.dto';
import { GetUsersQueryDto } from './dto/users-query.dto';
import { UserItemDto } from './dto/users-response.dto';

@Injectable()
export class AdminUserService {
  constructor(private readonly adminUserRepository: AdminUserRepository) {}

  async getUsers(query: GetUsersQueryDto): Promise<Paginated<UserItemDto>> {
    const role = query.role ?? Role.CLIENT;
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 50;
    const skip = (page - 1) * pageSize;

    const resolvedQuery: GetUsersQueryDto = {
      role,
      page: query.page,
      pageSize: query.pageSize,
      provider: query.provider,
      region: query.region,
      search: query.search,
    };

    const [rows, totalCount] = await Promise.all([
      this.adminUserRepository.findUsers(resolvedQuery, skip, pageSize),
      this.adminUserRepository.countUsers(resolvedQuery),
    ]);

    const items: UserItemDto[] = rows.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      provider: u.provider,
      region: u.region,
      paymentCount:
        role === Role.CLIENT
          ? u._count.ordersAsClient
          : u._count.ordersAsExpert,
      reportCount: u._count.receivedReports,
      createdAt: u.createdAt,
    }));

    return toPaginatedResponse(items, { page, pageSize, totalCount });
  }

  async getCounts(): Promise<UserCounstDto> {
    const [client, expert] = await Promise.all([
      this.adminUserRepository.countByRole(Role.CLIENT),
      this.adminUserRepository.countByRole(Role.EXPERT),
    ]);
    return { client, expert };
  }
}
