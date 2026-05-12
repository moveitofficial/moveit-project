/*
  Warnings:

  - The `reference_type` column on the `messages` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[email]` on the table `admins` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[client_profile_id,service_group_id,service_category_id]` on the table `client_interest_categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[expert_profile_id,service_group_id,service_category_id]` on the table `expert_specialty_categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[expert_profile_id,tech_stack_id]` on the table `expert_tech_stacks` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[payment_key]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[payment_key]` on the table `refunds` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `service_categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `service_groups` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[service_id,tech_stack_id]` on the table `service_tech_stacks` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[service_group_id,service_category_id]` on the table `statistics_by_category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `tech_stacks` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[provider,provider_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "MessageReferenceType" AS ENUM ('ORDER', 'PAYMENT');

-- DropForeignKey
ALTER TABLE "chat_participants" DROP CONSTRAINT "chat_participants_chat_room_id_fkey";

-- DropForeignKey
ALTER TABLE "cs_message_attachments" DROP CONSTRAINT "cs_message_attachments_message_id_fkey";

-- DropForeignKey
ALTER TABLE "message_attachments" DROP CONSTRAINT "message_attachments_message_id_fkey";

-- DropForeignKey
ALTER TABLE "portfolio_images" DROP CONSTRAINT "portfolio_images_portfolio_id_fkey";

-- DropForeignKey
ALTER TABLE "portfolio_skills" DROP CONSTRAINT "portfolio_skills_portfolio_id_fkey";

-- DropForeignKey
ALTER TABLE "refunds" DROP CONSTRAINT "refunds_approved_admin_id_fkey";

-- DropForeignKey
ALTER TABLE "reports_images" DROP CONSTRAINT "reports_images_reports_id_fkey";

-- DropForeignKey
ALTER TABLE "service_faqs" DROP CONSTRAINT "service_faqs_service_id_fkey";

-- DropForeignKey
ALTER TABLE "service_images" DROP CONSTRAINT "service_images_service_id_fkey";

-- DropForeignKey
ALTER TABLE "service_steps" DROP CONSTRAINT "service_steps_service_id_fkey";

-- DropForeignKey
ALTER TABLE "service_tech_stacks" DROP CONSTRAINT "service_tech_stacks_service_id_fkey";

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "reference_type",
ADD COLUMN     "reference_type" "MessageReferenceType";

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "payment_key" DROP NOT NULL,
ALTER COLUMN "raw_data" DROP NOT NULL;

-- AlterTable
ALTER TABLE "refunds" ALTER COLUMN "approved_admin_id" DROP NOT NULL,
ALTER COLUMN "payment_key" DROP NOT NULL,
ALTER COLUMN "raw_data" DROP NOT NULL;

-- AlterTable
ALTER TABLE "reviews" ALTER COLUMN "rating" DROP DEFAULT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "client_interest_categories_client_profile_id_service_group__key" ON "client_interest_categories"("client_profile_id", "service_group_id", "service_category_id");

-- CreateIndex
CREATE UNIQUE INDEX "expert_specialty_categories_expert_profile_id_service_group_key" ON "expert_specialty_categories"("expert_profile_id", "service_group_id", "service_category_id");

-- CreateIndex
CREATE UNIQUE INDEX "expert_tech_stacks_expert_profile_id_tech_stack_id_key" ON "expert_tech_stacks"("expert_profile_id", "tech_stack_id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_payment_key_key" ON "payments"("payment_key");

-- CreateIndex
CREATE UNIQUE INDEX "refunds_payment_key_key" ON "refunds"("payment_key");

-- CreateIndex
CREATE UNIQUE INDEX "service_categories_name_key" ON "service_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "service_groups_name_key" ON "service_groups"("name");

-- CreateIndex
CREATE UNIQUE INDEX "service_tech_stacks_service_id_tech_stack_id_key" ON "service_tech_stacks"("service_id", "tech_stack_id");

-- CreateIndex
CREATE UNIQUE INDEX "statistics_by_category_service_group_id_service_category_id_key" ON "statistics_by_category"("service_group_id", "service_category_id");

-- CreateIndex
CREATE UNIQUE INDEX "tech_stacks_name_key" ON "tech_stacks"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_provider_provider_id_key" ON "users"("provider", "provider_id");

-- AddForeignKey
ALTER TABLE "portfolio_images" ADD CONSTRAINT "portfolio_images_portfolio_id_fkey" FOREIGN KEY ("portfolio_id") REFERENCES "portfolios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio_skills" ADD CONSTRAINT "portfolio_skills_portfolio_id_fkey" FOREIGN KEY ("portfolio_id") REFERENCES "portfolios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_tech_stacks" ADD CONSTRAINT "service_tech_stacks_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_images" ADD CONSTRAINT "service_images_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_steps" ADD CONSTRAINT "service_steps_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_faqs" ADD CONSTRAINT "service_faqs_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_approved_admin_id_fkey" FOREIGN KEY ("approved_admin_id") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports_images" ADD CONSTRAINT "reports_images_reports_id_fkey" FOREIGN KEY ("reports_id") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_participants" ADD CONSTRAINT "chat_participants_chat_room_id_fkey" FOREIGN KEY ("chat_room_id") REFERENCES "chat_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_attachments" ADD CONSTRAINT "message_attachments_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cs_messages" ADD CONSTRAINT "cs_messages_senderUserId_fkey" FOREIGN KEY ("senderUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cs_messages" ADD CONSTRAINT "cs_messages_senderAdminId_fkey" FOREIGN KEY ("senderAdminId") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cs_message_attachments" ADD CONSTRAINT "cs_message_attachments_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "cs_messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
