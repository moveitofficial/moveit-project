/*
  Warnings:

  - The values [SETTLEMENT_REQUESTED] on the enum `NotificationCategory` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "NotificationCategory_new" AS ENUM ('POST_COMMENT', 'POST_REPLY', 'POST_LIKE', 'POST_DELETED_BY_ADMIN', 'COMMENT_DELETED_BY_ADMIN', 'EXPERT_APPROVED', 'EXPERT_REJECTED', 'ORDER_CREATED', 'PAYMENT_SUCCESS', 'ORDER_CANCEL_REQUESTED', 'ORDER_CANCEL_APPROVED_BY_EXPERT', 'ORDER_CANCEL_APPROVED_BY_ADMIN', 'ORDER_CANCELLED', 'REFUND_REQUESTED', 'REFUND_APPROVED_BY_EXPERT', 'REFUND_APPROVED_BY_ADMIN', 'WORK_COMPLETED', 'PURCHASE_CONFIRM_REQUEST', 'PURCHASE_CONFIRM_REMINDER', 'PURCHASE_CONFIRM_PENDING', 'PURCHASE_CONFIRMED', 'PURCHASE_AUTO_CONFIRMED', 'SETTLEMENT_REQUEST_REMINDER', 'SETTLEMENT_DONE', 'SCHEDULE_REGISTERED', 'SCHEDULE_CHANGE_REQUEST', 'SCHEDULE_CHANGED', 'SCHEDULE_REMINDER', 'DEADLINE_REMINDER', 'DEADLINE_EXPIRED');
ALTER TABLE "moveit_notifications" ALTER COLUMN "category" TYPE "NotificationCategory_new" USING ("category"::text::"NotificationCategory_new");
ALTER TYPE "NotificationCategory" RENAME TO "NotificationCategory_old";
ALTER TYPE "NotificationCategory_new" RENAME TO "NotificationCategory";
DROP TYPE "public"."NotificationCategory_old";
COMMIT;

-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'ACCOUNT';

-- AlterTable
ALTER TABLE "moveit_notifications" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "moveit_notifications_user_id_created_at_idx" ON "moveit_notifications"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "moveit_notifications_user_id_is_read_idx" ON "moveit_notifications"("user_id", "is_read");
