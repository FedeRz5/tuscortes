/**
 * Slot generation engine
 */

export interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function fromMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function overlaps(startA: number, endA: number, startB: number, endB: number): boolean {
  return startA < endB && endA > startB;
}

export interface GenerateSlotsParams {
  workStart: string;
  workEnd: string;
  durationMin: number;
  bufferMin?: number;                 // Minutes blocked after each appointment
  slotIntervalMin?: number;
  existingAppointments: { startTime: string; endTime: string }[];
  blockedSlots: { startTime: string; endTime: string }[];
  date: string;
  minAdvanceHours?: number;           // Min hours in advance to book
  appointmentsToday?: number;         // Already booked today
  maxAppointmentsPerDay?: number | null;
}

export function generateSlots(params: GenerateSlotsParams): TimeSlot[] {
  const {
    workStart,
    workEnd,
    durationMin,
    bufferMin = 0,
    slotIntervalMin,
    existingAppointments,
    blockedSlots,
    date,
    minAdvanceHours = 0,
    appointmentsToday = 0,
    maxAppointmentsPerDay,
  } = params;

  // If max reached, return empty
  if (maxAppointmentsPerDay != null && appointmentsToday >= maxAppointmentsPerDay) {
    return [];
  }

  const interval = slotIntervalMin ?? Math.min(durationMin, 30);
  const startMin = toMinutes(workStart);
  const endMin = toMinutes(workEnd);

  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const currentMin = now.getHours() * 60 + now.getMinutes();
  const minAdvanceMin = minAdvanceHours * 60;

  const slots: TimeSlot[] = [];

  for (let t = startMin; t + durationMin <= endMin; t += interval) {
    const slotEnd = t + durationMin;
    const startTime = fromMinutes(t);
    const endTime = fromMinutes(slotEnd);

    // Skip slots too close in time (today only)
    if (date === todayStr && t <= currentMin + minAdvanceMin) continue;

    // For future dates, check minAdvanceHours as a datetime comparison
    if (date > todayStr && minAdvanceHours > 0) {
      const slotDatetime = new Date(`${date}T${startTime}:00`);
      const minDatetime = new Date(now.getTime() + minAdvanceHours * 60 * 60 * 1000);
      if (slotDatetime < minDatetime) continue;
    }

    // Check against existing appointments (including their buffer)
    const blockedByApt = existingAppointments.some((apt) => {
      const aptEnd = toMinutes(apt.endTime) + bufferMin;
      return overlaps(t, slotEnd, toMinutes(apt.startTime), aptEnd);
    });

    // Check against manual blocked slots
    const manuallyBlocked = blockedSlots.some((b) =>
      overlaps(t, slotEnd, toMinutes(b.startTime), toMinutes(b.endTime))
    );

    slots.push({ startTime, endTime, available: !blockedByApt && !manuallyBlocked });
  }

  return slots;
}
