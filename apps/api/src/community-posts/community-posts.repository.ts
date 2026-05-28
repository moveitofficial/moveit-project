import { Injectable } from '@nestjs/common';
import { CommunityCategory, CommunityPost } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommunityPostsRepository {
  constructor(private readonly prisma: PrismaService) {}

  //   id       String            @id @default(uuid()) @db.Uuid
  // userId   String            @map("user_id") @db.Uuid
  // category CommunityCategory
  // title    String
  // content  String

  // deletedAt        DateTime? @map("deleted_at")
  // deleteReason     String?   @map("delete_reason")
  // deletedByAdminId String?   @map("deleted_by_admin_id") @db.Uuid

  // createdAt DateTime @default(now()) @map("created_at")

  // user           User      @relation(fields: [userId], references: [id])
  // deletedByAdmin Admin?    @relation(fields: [deletedByAdminId], references: [id])
  // comments       Comment[]
  // likeRecords    Like[]

  create(
    userId: string,
    data: {
      category: CommunityCategory;
      title: string;
      content: string;
    },
  ): Promise<CommunityPost> {
    const args = {
      data: {
        userId,
        category: data.category,
        title: data.title,
        content: data.content,
      },
    };

    return this.prisma.communityPost.create(args);
  }
}
