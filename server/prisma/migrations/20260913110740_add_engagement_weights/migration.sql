-- CreateTable
CREATE TABLE "engagement_weights" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "attendance" DOUBLE PRECISION NOT NULL DEFAULT 0.4,
    "taskCompletion" DOUBLE PRECISION NOT NULL DEFAULT 0.3,
    "workshopParticipation" DOUBLE PRECISION NOT NULL DEFAULT 0.2,
    "contribution" DOUBLE PRECISION NOT NULL DEFAULT 0.1,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "engagement_weights_pkey" PRIMARY KEY ("id")
);
