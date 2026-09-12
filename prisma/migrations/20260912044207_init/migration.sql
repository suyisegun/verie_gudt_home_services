-- CreateEnum
CREATE TYPE "LeadSource" AS ENUM ('WEBSITE', 'FACEBOOK');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUOTED', 'WON', 'LOST');

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "source" "LeadSource" NOT NULL,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "name" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "budget" TEXT,
    "timeline" TEXT,
    "installation" TEXT,
    "fbLeadId" TEXT,
    "fbFormId" TEXT,
    "fbFormName" TEXT,
    "fbPageId" TEXT,
    "raw" JSONB,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lead_fbLeadId_key" ON "Lead"("fbLeadId");

-- CreateIndex
CREATE INDEX "Lead_source_idx" ON "Lead"("source");

-- CreateIndex
CREATE INDEX "Lead_status_idx" ON "Lead"("status");

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");
