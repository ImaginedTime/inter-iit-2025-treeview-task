/*
  Warnings:

  - You are about to drop the column `parentGodownId` on the `Godown` table. All the data in the column will be lost.
  - You are about to drop the column `godownId` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Item` table. All the data in the column will be lost.
  - Added the required column `godown_id` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image_url` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Godown" DROP CONSTRAINT "Godown_parentGodownId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_godownId_fkey";

-- AlterTable
ALTER TABLE "Godown" DROP COLUMN "parentGodownId",
ADD COLUMN     "parent_godown_id" TEXT;

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "godownId",
DROP COLUMN "imageUrl",
ADD COLUMN     "godown_id" TEXT NOT NULL,
ADD COLUMN     "image_url" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Godown" ADD CONSTRAINT "Godown_parent_godown_id_fkey" FOREIGN KEY ("parent_godown_id") REFERENCES "Godown"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_godown_id_fkey" FOREIGN KEY ("godown_id") REFERENCES "Godown"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
