-- CreateTable
CREATE TABLE `employees` (
    `id` VARCHAR(191) NOT NULL,
    `matricule` VARCHAR(191) NOT NULL,
    `nom` VARCHAR(191) NOT NULL,
    `dateNaissance` VARCHAR(191) NOT NULL,
    `lieuNaissance` VARCHAR(191) NOT NULL,
    `sexe` VARCHAR(191) NOT NULL,
    `matrimoniale` VARCHAR(191) NOT NULL,
    `diplome` VARCHAR(191) NOT NULL,
    `contrat` VARCHAR(191) NOT NULL,
    `statutPro` VARCHAR(191) NOT NULL,
    `grade` VARCHAR(191) NOT NULL,
    `corpsMetier` VARCHAR(191) NOT NULL,
    `competences` VARCHAR(191) NOT NULL,
    `infosSupp` VARCHAR(191) NOT NULL,
    `position` VARCHAR(191) NOT NULL,
    `department` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
