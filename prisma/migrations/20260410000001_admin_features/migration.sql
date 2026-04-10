-- adminNotes en Organization
ALTER TABLE "Organization" ADD COLUMN "adminNotes" TEXT;

-- Tabla de log de actividad
CREATE TABLE "ActivityLog" (
  "id"             TEXT NOT NULL,
  "organizationId" TEXT,
  "action"         TEXT NOT NULL,
  "detail"         TEXT,
  "performedBy"    TEXT NOT NULL,
  "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ActivityLog_organizationId_fkey"
    FOREIGN KEY ("organizationId") REFERENCES "Organization"("id")
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla de tokens de impersonación
CREATE TABLE "ImpersonationToken" (
  "id"        TEXT NOT NULL,
  "userId"    TEXT NOT NULL,
  "token"     TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "used"      BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ImpersonationToken_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ImpersonationToken_token_key" ON "ImpersonationToken"("token");
