/*
  Warnings:

  - Added the required column `updatedAt` to the `Todo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Todo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- ALTER TABLE `todo` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
--     ADD COLUMN `userId` INTEGER NOT NULL;

-- -- AddForeignKey
-- ALTER TABLE `Todo` ADD CONSTRAINT `Todo_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE `Todo` ADD COLUMN `userId` INT DEFAULT 1;
ALTER TABLE `Todo` ADD COLUMN `updatedAt` DATETIME DEFAULT NOW();

UPDATE `Todo` SET `userId` = (SELECT id FROM `User` LIMIT 1);

ALTER TABLE `Todo` MODIFY `userId` INT NOT NULL;
ALTER TABLE `Todo` MODIFY `updatedAt` DATETIME NOT NULL;

ALTER TABLE `Todo` ADD CONSTRAINT `Todo_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
