/*
  Warnings:

  - You are about to drop the column `userId` on the `PublicFormDocument` table. All the data in the column will be lost.
  - You are about to drop the column `userName` on the `PublicFormDocument` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `PublicFormDocument` DROP COLUMN `userId`,
    DROP COLUMN `userName`;
