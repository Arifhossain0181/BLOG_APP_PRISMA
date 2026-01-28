/*
  Warnings:

  - You are about to drop the column `thumbail` on the `posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "thumbail",
ADD COLUMN     "thumbnail" VARCHAR(255);
