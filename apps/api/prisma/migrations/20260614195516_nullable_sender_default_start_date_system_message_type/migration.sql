/*
  Warnings:

  - The values [TRADE_REQUEST_SENT,TRADE_REQUEST_RECEIVED,PAYMENT_REQUEST,ORDER_COMPLETION_PENDING] on the enum `SystemMessageType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SystemMessageType_new" AS ENUM ('TRADE_REQUEST', 'TRADE_CANCELED', 'PAYMENT_COMPLETED', 'PAYMENT_HELD', 'SCHEDULE_REQUEST', 'SCHEDULE_REGISTERED', 'SCHEDULE_CHANGE_REQUEST');
ALTER TABLE "messages" ALTER COLUMN "system_type" TYPE "SystemMessageType_new" USING ("system_type"::text::"SystemMessageType_new");
ALTER TYPE "SystemMessageType" RENAME TO "SystemMessageType_old";
ALTER TYPE "SystemMessageType_new" RENAME TO "SystemMessageType";
DROP TYPE "public"."SystemMessageType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_sender_id_fkey";

-- AlterTable
ALTER TABLE "messages" ALTER COLUMN "sender_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "start_date" SET DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
