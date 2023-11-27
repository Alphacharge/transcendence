/*
  Warnings:

  - You are about to drop the column `tournament_id` on the `Games` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Games" DROP CONSTRAINT "Games_tournament_id_fkey";

-- AlterTable
ALTER TABLE "Games" DROP COLUMN "tournament_id";
