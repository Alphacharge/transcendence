-- AlterTable
ALTER TABLE "Games" ADD COLUMN     "tournament_id" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Games" ADD CONSTRAINT "Games_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "Tournaments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
