-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "start_date" DROP NOT NULL,
ALTER COLUMN "start_date" DROP DEFAULT;
