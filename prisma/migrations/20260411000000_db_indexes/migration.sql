-- Indexes for Appointment (most queried table)
CREATE INDEX IF NOT EXISTS "Appointment_organizationId_date_idx" ON "Appointment"("organizationId", "date");
CREATE INDEX IF NOT EXISTS "Appointment_staffId_date_idx" ON "Appointment"("staffId", "date");

-- Indexes for ActivityLog
CREATE INDEX IF NOT EXISTS "ActivityLog_organizationId_idx" ON "ActivityLog"("organizationId");
CREATE INDEX IF NOT EXISTS "ActivityLog_createdAt_idx" ON "ActivityLog"("createdAt");

-- Index for BlockedSlot
CREATE INDEX IF NOT EXISTS "BlockedSlot_organizationId_date_idx" ON "BlockedSlot"("organizationId", "date");

-- Index for VacationBlock
CREATE INDEX IF NOT EXISTS "VacationBlock_organizationId_startDate_endDate_idx" ON "VacationBlock"("organizationId", "startDate", "endDate");
