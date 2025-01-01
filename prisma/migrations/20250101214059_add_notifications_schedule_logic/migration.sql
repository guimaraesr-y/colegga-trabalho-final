-- AlterTable
ALTER TABLE `Notification` ADD COLUMN `isSent` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `sendDate` DATETIME(3) NULL;
