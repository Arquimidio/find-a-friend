/*
  Warnings:

  - You are about to drop the column `city` on the `Pet` table. All the data in the column will be lost.
  - Added the required column `CEP` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `environment` to the `Pet` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PetEnvironmentSize" AS ENUM ('SMALL', 'MEDIUM', 'BIG');

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "CEP" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Pet" DROP COLUMN "city",
ADD COLUMN     "adoptionRequirements" JSONB[],
ADD COLUMN     "environment" "PetEnvironmentSize" NOT NULL;
