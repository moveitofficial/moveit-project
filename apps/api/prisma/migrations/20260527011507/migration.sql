/*
  Warnings:

  - A unique constraint covering the columns `[client_user_id,expert_user_id,current_service_id]` on the table `chat_rooms` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "chat_rooms_client_user_id_expert_user_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "chat_rooms_client_user_id_expert_user_id_current_service_id_key" ON "chat_rooms"("client_user_id", "expert_user_id", "current_service_id");
