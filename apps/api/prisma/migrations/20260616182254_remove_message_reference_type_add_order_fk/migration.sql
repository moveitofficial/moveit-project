/*
  Warnings:

  - You are about to drop the column `reference_id` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `reference_type` on the `messages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "messages" DROP COLUMN "reference_id",
DROP COLUMN "reference_type",
ADD COLUMN     "order_id" UUID;

-- DropEnum
DROP TYPE "MessageReferenceType";

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
