/*
  Warnings:

  - Made the column `avatar` on table `Users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "avatar" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_avatar_fkey" FOREIGN KEY ("avatar") REFERENCES "Avatars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
