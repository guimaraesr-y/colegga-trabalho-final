-- CreateTable
CREATE TABLE `Flash` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NULL,
    `content` VARCHAR(191) NULL,
    `isComment` BOOLEAN NOT NULL DEFAULT false,
    `refId` VARCHAR(191) NULL,
    `authorId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Flash_authorId_refId_idx`(`authorId`, `refId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Flash` ADD CONSTRAINT `Flash_refId_fkey` FOREIGN KEY (`refId`) REFERENCES `Flash`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Flash` ADD CONSTRAINT `Flash_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
