-- Partial unique index: un barbero no puede tener dos turnos activos en el mismo horario.
-- Los turnos CANCELLED quedan excluidos del índice para poder reutilizar el slot.
CREATE UNIQUE INDEX "appointment_slot_unique"
  ON "Appointment" ("staffId", "date", "startTime")
  WHERE status != 'CANCELLED';
