/*
  Warnings:

  - You are about to drop the column `CEP` on the `Organization` table. All the data in the column will be lost.
  - Added the required column `cep` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "CEP",
ADD COLUMN     "cep" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Pet" ALTER COLUMN "adoptionRequirements" SET DEFAULT ARRAY[]::JSONB[];
