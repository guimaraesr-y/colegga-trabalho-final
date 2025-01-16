-- DropForeignKey
ALTER TABLE `Flash` DROP FOREIGN KEY `Flash_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `UserLikedFlashes` DROP FOREIGN KEY `UserLikedFlashes_flashId_fkey`;

-- DropForeignKey
ALTER TABLE `UserLikedFlashes` DROP FOREIGN KEY `UserLikedFlashes_userId_fkey`;

-- DropForeignKey
ALTER TABLE `UserNotification` DROP FOREIGN KEY `UserNotification_notificationId_fkey`;

-- DropForeignKey
ALTER TABLE `UserNotification` DROP FOREIGN KEY `UserNotification_userId_fkey`;

-- DropIndex
DROP INDEX `UserLikedFlashes_userId_fkey` ON `UserLikedFlashes`;

-- DropIndex
DROP INDEX `UserNotification_notificationId_fkey` ON `UserNotification`;

-- DropIndex
DROP INDEX `UserNotification_userId_fkey` ON `UserNotification`;

-- AddForeignKey
ALTER TABLE `UserNotification` ADD CONSTRAINT `UserNotification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserNotification` ADD CONSTRAINT `UserNotification_notificationId_fkey` FOREIGN KEY (`notificationId`) REFERENCES `Notification`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Flash` ADD CONSTRAINT `Flash_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserLikedFlashes` ADD CONSTRAINT `UserLikedFlashes_flashId_fkey` FOREIGN KEY (`flashId`) REFERENCES `Flash`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserLikedFlashes` ADD CONSTRAINT `UserLikedFlashes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
