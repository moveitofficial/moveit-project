import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { expertProfileInclude } from './expert-profiles.types';

import type { ExpertProfileWithRelations } from './expert-profiles.types';
import type { CategoryInput } from '../common/types/category.types';
import type { ExpertProfile, Prisma, TechStackName } from '@prisma/client';

@Injectable()
export class ExpertProfilesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByUserId(userId: string): Promise<ExpertProfile | null> {
    return this.prisma.expertProfile.findUnique({
      where: { userId },
    });
  }

  findByUserIdWithRelations(
    userId: string,
  ): Promise<ExpertProfileWithRelations | null> {
    return this.prisma.expertProfile.findUnique({
      where: { userId },
      include: expertProfileInclude,
    });
  }

  create(
    userId: string,
    data: {
      businessName?: string;
      businessNumber?: string;
      ceoName?: string;
      contactTimeStart?: string;
      contactTimeEnd?: string;
      foundedYear?: number;
      employeeMin?: number;
      employeeMax?: number;
      description?: string;
      specialtyCategories?: CategoryInput[];
      techStackNames?: TechStackName[];
    },
    tx?: Prisma.TransactionClient,
  ): Promise<ExpertProfileWithRelations> {
    const args = {
      data: {
        userId,
        businessName: data.businessName,
        businessNumber: data.businessNumber,
        ceoName: data.ceoName,
        contactTimeStart: data.contactTimeStart,
        contactTimeEnd: data.contactTimeEnd,
        foundedYear: data.foundedYear,
        employeeMin: data.employeeMin,
        employeeMax: data.employeeMax,
        description: data.description,
        specialtyCategories: {
          create:
            data.specialtyCategories?.map((c) => ({
              serviceGroup: { connect: { name: c.group } },
              serviceCategory: { connect: { name: c.category } },
            })) ?? [],
        },
        techStacks: {
          create:
            data.techStackNames?.map((name) => ({
              techStack: { connect: { name } },
            })) ?? [],
        },
      },
      include: expertProfileInclude,
    } satisfies Prisma.ExpertProfileCreateArgs;

    if (tx) return tx.expertProfile.create(args);
    return this.prisma.expertProfile.create(args);
  }

  update(
    userId: string,
    data: {
      businessName?: string;
      businessNumber?: string;
      ceoName?: string;
      contactTimeStart?: string;
      contactTimeEnd?: string;
      foundedYear?: number;
      employeeMin?: number;
      employeeMax?: number;
      description?: string;
      specialtyCategories?: CategoryInput[];
      techStackNames?: TechStackName[];
    },
    tx?: Prisma.TransactionClient,
  ): Promise<ExpertProfileWithRelations> {
    const args = {
      where: { userId },
      data: {
        businessName: data.businessName,
        businessNumber: data.businessNumber,
        ceoName: data.ceoName,
        contactTimeStart: data.contactTimeStart,
        contactTimeEnd: data.contactTimeEnd,
        foundedYear: data.foundedYear,
        employeeMin: data.employeeMin,
        employeeMax: data.employeeMax,
        description: data.description,
        specialtyCategories:
          data.specialtyCategories === undefined
            ? undefined
            : {
                deleteMany: {},
                create: data.specialtyCategories.map((c) => ({
                  serviceGroup: { connect: { name: c.group } },
                  serviceCategory: { connect: { name: c.category } },
                })),
              },
        techStacks:
          data.techStackNames === undefined
            ? undefined
            : {
                deleteMany: {},
                create: data.techStackNames.map((name) => ({
                  techStack: { connect: { name } },
                })),
              },
      },
      include: expertProfileInclude,
    } satisfies Prisma.ExpertProfileUpdateArgs;

    if (tx) return tx.expertProfile.update(args);
    return this.prisma.expertProfile.update(args);
  }

  async isBusinessNumberAvailable(businessNumber: string): Promise<boolean> {
    const count = await this.prisma.expertProfile.count({
      where: { businessNumber },
    });
    return count === 0;
  }

  applyForApproval(userId: string): Promise<ExpertProfileWithRelations> {
    return this.prisma.expertProfile.update({
      where: { userId },
      data: { isApplied: true, appliedAt: new Date() },
      include: expertProfileInclude,
    });
  }
}
