/*
  Warnings:

  - You are about to drop the column `googleId` on the `user` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `User_googleId_key` ON `user`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `googleId`;

-- CreateTable
CREATE TABLE `Sns` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `snsId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `Sns_snsId_key`(`snsId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Sns` ADD CONSTRAINT `Sns_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
