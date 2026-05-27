-- CreateTable
CREATE TABLE "recently_viewed_services" (
    "id" UUID NOT NULL,
    "client_user_id" UUID NOT NULL,
    "service_id" UUID NOT NULL,
    "viewed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recently_viewed_services_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "recently_viewed_services_client_user_id_service_id_key" ON "recently_viewed_services"("client_user_id", "service_id");

-- AddForeignKey
ALTER TABLE "recently_viewed_services" ADD CONSTRAINT "recently_viewed_services_client_user_id_fkey" FOREIGN KEY ("client_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recently_viewed_services" ADD CONSTRAINT "recently_viewed_services_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
