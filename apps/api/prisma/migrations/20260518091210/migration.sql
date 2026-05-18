/*
  Warnings:

  - You are about to drop the column `likes` on the `community_posts` table. All the data in the column will be lost.
  - You are about to drop the column `senderAdminId` on the `cs_messages` table. All the data in the column will be lost.
  - You are about to drop the column `senderType` on the `cs_messages` table. All the data in the column will be lost.
  - You are about to drop the column `senderUserId` on the `cs_messages` table. All the data in the column will be lost.
  - You are about to drop the column `reason` on the `refunds` table. All the data in the column will be lost.
  - You are about to drop the column `client_user_id` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `expert_user_id` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `statistics_by_category` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `statistics_by_seller` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[service_group_id,service_category_id,date]` on the table `statistics_by_category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[seller_user_id,date]` on the table `statistics_by_seller` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sender_type` to the `cs_messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reported_id` to the `reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reporter_id` to the `reports` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `reason` on the `reports` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `date` to the `statistics_by_category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `statistics_by_seller` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AdminActionType" AS ENUM ('EXPERT_APPROVED', 'EXPERT_REJECTED', 'MAIN_UPDATED', 'FAQ_CREATED', 'FAQ_UPDATED', 'FAQ_DELETED', 'BLACKLIST_ADDED', 'BLACKLIST_REMOVED', 'REFUND_APPROVED', 'CANCEL_APPROVED', 'CS_ASSIGNED', 'CS_CLOSED');

-- CreateEnum
CREATE TYPE "ReportReason" AS ENUM ('FALSE_INFORMATION', 'ABUSE', 'ILLEGAL_ACTIVITY', 'EXTERNAL_CONTACT', 'SPAM', 'OTHER');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'COMPLETED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NotificationCategory" ADD VALUE 'PURCHASE_CONFIRMED';
ALTER TYPE "NotificationCategory" ADD VALUE 'SETTLEMENT_REQUESTED';
ALTER TYPE "NotificationCategory" ADD VALUE 'SCHEDULE_REGISTERED';
ALTER TYPE "NotificationCategory" ADD VALUE 'SCHEDULE_CHANGE_REQUEST';
ALTER TYPE "NotificationCategory" ADD VALUE 'SCHEDULE_REMINDER';

-- AlterEnum
ALTER TYPE "SystemMessageType" ADD VALUE 'SCHEDULE_CHANGE_REQUEST';

-- DropForeignKey
ALTER TABLE "cs_messages" DROP CONSTRAINT "cs_messages_senderAdminId_fkey";

-- DropForeignKey
ALTER TABLE "cs_messages" DROP CONSTRAINT "cs_messages_senderUserId_fkey";

-- DropForeignKey
ALTER TABLE "reports" DROP CONSTRAINT "reports_client_user_id_fkey";

-- DropForeignKey
ALTER TABLE "reports" DROP CONSTRAINT "reports_expert_user_id_fkey";

-- DropIndex
DROP INDEX "statistics_by_category_service_group_id_service_category_id_key";

-- DropIndex
DROP INDEX "statistics_by_seller_seller_user_id_key";

-- AlterTable
ALTER TABLE "comments" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by_admin_id" UUID;

-- AlterTable
ALTER TABLE "community_posts" DROP COLUMN "likes";

-- AlterTable
ALTER TABLE "cs_messages" DROP COLUMN "senderAdminId",
DROP COLUMN "senderType",
DROP COLUMN "senderUserId",
ADD COLUMN     "sender_admin_id" UUID,
ADD COLUMN     "sender_type" "SenderType" NOT NULL,
ADD COLUMN     "sender_user_id" UUID;

-- AlterTable
ALTER TABLE "expert_profiles" ADD COLUMN     "approved_by_admin_id" UUID,
ADD COLUMN     "is_applied" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "rejected_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "settled_at" TIMESTAMP(3),
ADD COLUMN     "settled_by_admin_id" UUID;

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "installment_months" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "refunds" DROP COLUMN "reason",
ADD COLUMN     "admin_reason" TEXT;

-- AlterTable
ALTER TABLE "reports" DROP COLUMN "client_user_id",
DROP COLUMN "expert_user_id",
ADD COLUMN     "reported_id" UUID NOT NULL,
ADD COLUMN     "reporter_id" UUID NOT NULL,
ADD COLUMN     "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
DROP COLUMN "reason",
ADD COLUMN     "reason" "ReportReason" NOT NULL;

-- AlterTable
ALTER TABLE "services" ADD COLUMN     "preparation_notes" TEXT;

-- AlterTable
ALTER TABLE "statistics_by_category" DROP COLUMN "updated_at",
ADD COLUMN     "date" DATE NOT NULL;

-- AlterTable
ALTER TABLE "statistics_by_seller" DROP COLUMN "updated_at",
ADD COLUMN     "date" DATE NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "blocked_at" TIMESTAMP(3),
ADD COLUMN     "blocked_by_admin_id" UUID,
ADD COLUMN     "deletion_reason" TEXT;

-- CreateTable
CREATE TABLE "category_featured_services" (
    "id" UUID NOT NULL,
    "service_group_id" UUID NOT NULL,
    "service_id" UUID NOT NULL,

    CONSTRAINT "category_featured_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_activity_logs" (
    "id" UUID NOT NULL,
    "admin_id" UUID NOT NULL,
    "action_type" "AdminActionType" NOT NULL,
    "reference_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "category_featured_services_service_group_id_service_id_key" ON "category_featured_services"("service_group_id", "service_id");

-- CreateIndex
CREATE UNIQUE INDEX "statistics_by_category_service_group_id_service_category_id_key" ON "statistics_by_category"("service_group_id", "service_category_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "statistics_by_seller_seller_user_id_date_key" ON "statistics_by_seller"("seller_user_id", "date");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_blocked_by_admin_id_fkey" FOREIGN KEY ("blocked_by_admin_id") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expert_profiles" ADD CONSTRAINT "expert_profiles_approved_by_admin_id_fkey" FOREIGN KEY ("approved_by_admin_id") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_settled_by_admin_id_fkey" FOREIGN KEY ("settled_by_admin_id") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_reported_id_fkey" FOREIGN KEY ("reported_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_deleted_by_admin_id_fkey" FOREIGN KEY ("deleted_by_admin_id") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main_settings" ADD CONSTRAINT "main_settings_target_user_id_fkey" FOREIGN KEY ("target_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "main_settings" ADD CONSTRAINT "main_settings_target_service_id_fkey" FOREIGN KEY ("target_service_id") REFERENCES "services"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_featured_services" ADD CONSTRAINT "category_featured_services_service_group_id_fkey" FOREIGN KEY ("service_group_id") REFERENCES "service_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_featured_services" ADD CONSTRAINT "category_featured_services_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_activity_logs" ADD CONSTRAINT "admin_activity_logs_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_participants" ADD CONSTRAINT "chat_participants_last_read_message_id_fkey" FOREIGN KEY ("last_read_message_id") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cs_messages" ADD CONSTRAINT "cs_messages_sender_user_id_fkey" FOREIGN KEY ("sender_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cs_messages" ADD CONSTRAINT "cs_messages_sender_admin_id_fkey" FOREIGN KEY ("sender_admin_id") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;
