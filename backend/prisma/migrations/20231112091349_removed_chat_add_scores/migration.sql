/*
  Warnings:

  - You are about to drop the `ChatMemberships` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Chats` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Messages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Scores` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `left_user_score` to the `Games` table without a default value. This is not possible if the table is not empty.
  - Added the required column `right_user_score` to the `Games` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ChatMemberships" DROP CONSTRAINT "ChatMemberships_chat_id_fkey";

-- DropForeignKey
ALTER TABLE "ChatMemberships" DROP CONSTRAINT "ChatMemberships_role_id_fkey";

-- DropForeignKey
ALTER TABLE "ChatMemberships" DROP CONSTRAINT "ChatMemberships_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_chat_id_fkey";

-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Roles" DROP CONSTRAINT "Roles_parent_role_id_fkey";

-- DropForeignKey
ALTER TABLE "Scores" DROP CONSTRAINT "Scores_game_id_fkey";

-- DropForeignKey
ALTER TABLE "Scores" DROP CONSTRAINT "Scores_user_id_fkey";

-- AlterTable
ALTER TABLE "Games" ADD COLUMN     "left_user_score" INTEGER NOT NULL,
ADD COLUMN     "right_user_score" INTEGER NOT NULL;

-- DropTable
DROP TABLE "ChatMemberships";

-- DropTable
DROP TABLE "Chats";

-- DropTable
DROP TABLE "Messages";

-- DropTable
DROP TABLE "Roles";

-- DropTable
DROP TABLE "Scores";

-- AddForeignKey
ALTER TABLE "Games" ADD CONSTRAINT "Games_left_user_id_fkey" FOREIGN KEY ("left_user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Games" ADD CONSTRAINT "Games_right_user_id_fkey" FOREIGN KEY ("right_user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
