/*
  Warnings:

  - Added the required column `tourwinner_id` to the `Tournaments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Games" ADD COLUMN     "winner_id" INTEGER NOT NULL DEFAULT -1;

-- AlterTable
ALTER TABLE "Tournaments" ADD COLUMN     "tourwinner_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Games" ADD CONSTRAINT "Games_winner_id_fkey" FOREIGN KEY ("winner_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tournaments" ADD CONSTRAINT "Tournaments_tourwinner_id_fkey" FOREIGN KEY ("tourwinner_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
