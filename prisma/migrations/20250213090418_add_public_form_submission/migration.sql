/*
  Warnings:

  - You are about to alter the column `service` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `service` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `PublicFormSubmission` (
    `id` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `region` VARCHAR(191) NOT NULL,
    `adminDepartment` VARCHAR(191) NOT NULL,
    `arrondissement` VARCHAR(191) NOT NULL,
    `village` VARCHAR(191) NOT NULL,
    `requestType` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
