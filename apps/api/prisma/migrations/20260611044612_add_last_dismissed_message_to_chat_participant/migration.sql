-- AlterTable
ALTER TABLE "chat_participants" ADD COLUMN     "last_dismissed_message_id" UUID;

-- AddForeignKey
ALTER TABLE "chat_participants" ADD CONSTRAINT "chat_participants_last_dismissed_message_id_fkey" FOREIGN KEY ("last_dismissed_message_id") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
