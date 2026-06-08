import { Injectable } from '@nestjs/common';
import { AdminActionType, Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminFaqRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(skip: number, take: number) {
    return this.prisma.faq.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });
  }

  count(): Promise<number> {
    return this.prisma.faq.count();
  }

  // 존재 검증용 — 수정 전 단건 확인
  findById(id: string): Promise<{ id: string } | null> {
    return this.prisma.faq.findUnique({
      where: { id },
      select: { id: true },
    });
  }

  // 존재 검증용 — 일괄 삭제 시 ids 중 실제 존재하는 id들 반환
  findIdsByIds(ids: string[]): Promise<string[]> {
    return this.prisma.faq
      .findMany({
        where: { id: { in: ids } },
        select: { id: true },
      })
      .then((rows) => rows.map((r) => r.id));
  }

  // 등록 트랜잭션 — Faq.create + 활동로그
  createFaq(params: {
    data: Prisma.FaqCreateInput;
    adminId: string;
  }): Promise<{ id: string }> {
    const { data, adminId } = params;

    return this.prisma.$transaction(async (tx) => {
      const created = await tx.faq.create({
        data,
        select: { id: true },
      });

      await tx.adminActivityLog.create({
        data: {
          adminId,
          actionType: AdminActionType.FAQ_CREATED,
          referenceId: created.id,
        },
      });

      return created;
    });
  }

  // 수정 트랜잭션 — Faq.update + 활동로그
  updateFaq(params: {
    id: string;
    data: Prisma.FaqUpdateInput;
    adminId: string;
  }): Promise<void> {
    const { id, data, adminId } = params;

    return this.prisma.$transaction(async (tx) => {
      await tx.faq.update({ where: { id }, data });

      await tx.adminActivityLog.create({
        data: {
          adminId,
          actionType: AdminActionType.FAQ_UPDATED,
          referenceId: id,
        },
      });
    });
  }

  // 삭제 트랜잭션 — 활동로그 createMany + Faq.deleteMany
  deleteFaqs(params: { ids: string[]; adminId: string }): Promise<void> {
    const { ids, adminId } = params;

    return this.prisma.$transaction(async (tx) => {
      await tx.adminActivityLog.createMany({
        data: ids.map((id) => ({
          adminId,
          actionType: AdminActionType.FAQ_DELETED,
          referenceId: id,
        })),
      });

      await tx.faq.deleteMany({
        where: { id: { in: ids } },
      });
    });
  }
}
