/*
  Warnings:

  - You are about to drop the column `isTwoFactorEnabled` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `twoFactorSecret` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "isTwoFactorEnabled",
DROP COLUMN "twoFactorSecret",
ADD COLUMN     "two_factor_enabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "two_factor_secret" TEXT DEFAULT '';
