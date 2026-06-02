-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NotificationCategory" ADD VALUE 'EXPERT_APPROVED';
ALTER TYPE "NotificationCategory" ADD VALUE 'EXPERT_REJECTED';

-- AlterTable
ALTER TABLE "moveit_notifications" ALTER COLUMN "reference_type" DROP NOT NULL,
ALTER COLUMN "reference_id" DROP NOT NULL;
