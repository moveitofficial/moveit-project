/*
  Warnings:

  - The values [PENDING_PAYMENT,PAID,COMPLETED,CANCELLED,REFUNDED] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('NEGOTIATING', 'CANCEL_REQUESTED', 'PAYMENT_CANCELLED', 'IN_PROGRESS', 'DEADLINE_IMMINENT', 'EXPIRED', 'WORK_COMPLETED', 'PURCHASE_CONFIRMED', 'SETTLEMENT_REQUESTED', 'SETTLEMENT_COMPLETED', 'REFUND_REQUESTED', 'REFUND_COMPLETED');
ALTER TABLE "orders" ALTER COLUMN "status" TYPE "OrderStatus_new" USING ("status"::text::"OrderStatus_new");
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "public"."OrderStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "reviews" ALTER COLUMN "rating" SET DEFAULT 0;
