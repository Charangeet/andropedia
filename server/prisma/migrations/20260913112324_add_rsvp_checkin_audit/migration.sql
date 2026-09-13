-- CreateEnum
CREATE TYPE "RsvpResponse" AS ENUM ('yes', 'no', 'maybe');

-- AlterTable: add checkinToken as nullable first, backfill, then enforce NOT NULL
ALTER TABLE "events" ADD COLUMN "checkinToken" TEXT;

UPDATE "events" SET "checkinToken" = md5(random()::text || id::text || clock_timestamp()::text);

ALTER TABLE "events" ALTER COLUMN "checkinToken" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "events_checkinToken_key" ON "events"("checkinToken");

-- CreateTable
CREATE TABLE "rsvps" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,
    "response" "RsvpResponse" NOT NULL,
    "respondedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rsvps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rsvps_memberId_eventId_key" ON "rsvps"("memberId", "eventId");

-- AddForeignKey
ALTER TABLE "rsvps" ADD CONSTRAINT "rsvps_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rsvps" ADD CONSTRAINT "rsvps_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" SERIAL NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" INTEGER,
    "actor" TEXT NOT NULL,
    "summary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);
