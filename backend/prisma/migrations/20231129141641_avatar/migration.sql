-- CreateTable
CREATE TABLE "Avatars" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Avatars_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Avatars" ADD CONSTRAINT "Avatars_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
