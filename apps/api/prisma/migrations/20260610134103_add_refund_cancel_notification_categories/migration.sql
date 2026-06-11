-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NotificationCategory" ADD VALUE 'ORDER_CANCEL_REQUESTED_TO_CLIENT';
ALTER TYPE "NotificationCategory" ADD VALUE 'ORDER_CANCEL_REJECTED_BY_EXPERT';
ALTER TYPE "NotificationCategory" ADD VALUE 'REFUND_REQUESTED_TO_CLIENT';
ALTER TYPE "NotificationCategory" ADD VALUE 'REFUND_REJECTED_BY_EXPERT';
