/*
  Warnings:

  - A unique constraint covering the columns `[business_number]` on the table `expert_profiles` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "expert_profiles_business_number_key" ON "expert_profiles"("business_number");
