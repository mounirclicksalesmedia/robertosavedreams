-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'INVESTOR';

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "investmentApplicationId" TEXT;

-- CreateTable
CREATE TABLE "InvestmentApplication" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,
    "organizationName" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "investorId" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvestmentApplication_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InvestmentApplication" ADD CONSTRAINT "InvestmentApplication_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_investmentApplicationId_fkey" FOREIGN KEY ("investmentApplicationId") REFERENCES "InvestmentApplication"("id") ON DELETE SET NULL ON UPDATE CASCADE;
