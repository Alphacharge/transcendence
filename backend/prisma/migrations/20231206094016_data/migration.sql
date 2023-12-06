/*
  Warnings:

  - Made the column `left_user_score` on table `Games` required. This step will fail if there are existing NULL values in that column.
  - Made the column `right_user_score` on table `Games` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Games" ADD COLUMN     "left_user_contacts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "longest_break" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "right_user_contacts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "left_user_score" SET NOT NULL,
ALTER COLUMN "left_user_score" SET DEFAULT 0,
ALTER COLUMN "right_user_score" SET NOT NULL,
ALTER COLUMN "right_user_score" SET DEFAULT 0;
