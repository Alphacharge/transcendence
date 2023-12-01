/*
  Warnings:

  - You are about to drop the column `user_id` on the `Avatars` table. All the data in the column will be lost.
  - You are about to drop the column `avatar` on the `Users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Avatars" DROP CONSTRAINT "Avatars_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_avatar_fkey";

-- AlterTable
ALTER TABLE "Avatars" DROP COLUMN "user_id";

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "avatar",
ADD COLUMN     "avatar_id" INTEGER NOT NULL DEFAULT -1;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_avatar_id_fkey" FOREIGN KEY ("avatar_id") REFERENCES "Avatars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
