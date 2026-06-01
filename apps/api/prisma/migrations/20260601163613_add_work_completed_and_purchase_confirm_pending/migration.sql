-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NotificationCategory" ADD VALUE 'ORDER_CANCEL_REQUESTED';
ALTER TYPE "NotificationCategory" ADD VALUE 'WORK_COMPLETED';
ALTER TYPE "NotificationCategory" ADD VALUE 'PURCHASE_CONFIRM_PENDING';
