-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `service` ENUM('BUREAU_DU_COURRIER', 'RECETTE_DEPARTEMENTALE_DES_DOMAINES', 'CONSERVATION_FONCIERE', 'SERVICE_DEPARTEMENTAL_DES_DOMAINES', 'SERVICE_DEPARTEMENTAL_DES_AFFAIRES_FONCIERES', 'SERVICE_DEPARTEMENTAL_DU_PATRIMOINE_DE_L_ETAT', 'SERVICE_DEPARTEMENTAL_DU_CADASTRE', 'AUTRES_SERVICES', 'SECTION_PUBLIC') NOT NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'user',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
