-- AlterTable
ALTER TABLE "cs_chat_rooms" ADD COLUMN     "admin_last_read_message_id" UUID,
ADD COLUMN     "user_last_read_message_id" UUID;
