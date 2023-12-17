-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "username" TEXT NOT NULL DEFAULT '',
    "hash" TEXT NOT NULL,
    "avatar_id" INTEGER NOT NULL DEFAULT 1,
    "two_factor_enabled" BOOLEAN NOT NULL DEFAULT false,
    "two_factor_secret" TEXT DEFAULT '',
    "language" TEXT NOT NULL DEFAULT 'en',
    "oauth" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Games" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "left_user_id" INTEGER NOT NULL,
    "right_user_id" INTEGER NOT NULL,
    "left_user_score" INTEGER NOT NULL DEFAULT 0,
    "right_user_score" INTEGER NOT NULL DEFAULT 0,
    "left_user_contacts" INTEGER NOT NULL DEFAULT 0,
    "right_user_contacts" INTEGER NOT NULL DEFAULT 0,
    "longest_break" INTEGER NOT NULL DEFAULT 0,
    "winner_id" INTEGER NOT NULL DEFAULT -1,

    CONSTRAINT "Games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tournaments" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "first_game_id" INTEGER NOT NULL,
    "second_game_id" INTEGER NOT NULL,
    "third_game_id" INTEGER NOT NULL,
    "tourwinner_id" INTEGER NOT NULL,

    CONSTRAINT "Tournaments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Friends" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "friend_id" INTEGER NOT NULL,

    CONSTRAINT "Friends_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Avatars" (
    "id" SERIAL NOT NULL,
    "mime_type" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Avatars_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_avatar_id_fkey" FOREIGN KEY ("avatar_id") REFERENCES "Avatars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Games" ADD CONSTRAINT "Games_left_user_id_fkey" FOREIGN KEY ("left_user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Games" ADD CONSTRAINT "Games_right_user_id_fkey" FOREIGN KEY ("right_user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Games" ADD CONSTRAINT "Games_winner_id_fkey" FOREIGN KEY ("winner_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tournaments" ADD CONSTRAINT "Tournaments_first_game_id_fkey" FOREIGN KEY ("first_game_id") REFERENCES "Games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tournaments" ADD CONSTRAINT "Tournaments_second_game_id_fkey" FOREIGN KEY ("second_game_id") REFERENCES "Games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tournaments" ADD CONSTRAINT "Tournaments_third_game_id_fkey" FOREIGN KEY ("third_game_id") REFERENCES "Games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tournaments" ADD CONSTRAINT "Tournaments_tourwinner_id_fkey" FOREIGN KEY ("tourwinner_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_friend_id_fkey" FOREIGN KEY ("friend_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
