-- CreateTable
CREATE TABLE "Tournaments" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "first_game_id" INTEGER NOT NULL,
    "second_game_id" INTEGER NOT NULL,
    "third_game_id" INTEGER NOT NULL DEFAULT -1,

    CONSTRAINT "Tournaments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Tournaments" ADD CONSTRAINT "Tournaments_first_game_id_fkey" FOREIGN KEY ("first_game_id") REFERENCES "Games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tournaments" ADD CONSTRAINT "Tournaments_second_game_id_fkey" FOREIGN KEY ("second_game_id") REFERENCES "Games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tournaments" ADD CONSTRAINT "Tournaments_third_game_id_fkey" FOREIGN KEY ("third_game_id") REFERENCES "Games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
