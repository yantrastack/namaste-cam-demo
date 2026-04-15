/** Local calendar helpers for staff earnings date pickers (no UTC day-shift). */

export function toIsoLocal(d: Date): string {
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return `${y.toString().padStart(4, "0")}-${m.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
}

export function parseIsoLocal(iso: string): Date {
  const [y, mo, da] = iso.split("-").map(Number);
  return new Date(y, (mo ?? 1) - 1, da ?? 1, 12, 0, 0, 0);
}

/** Monday-start week containing `d`. */
export function startOfWeekMonday(d: Date): Date {
  const c = new Date(d);
  c.setHours(12, 0, 0, 0);
  const day = c.getDay();
  const offset = day === 0 ? -6 : 1 - day;
  c.setDate(c.getDate() + offset);
  return c;
}

export function endOfWeekFromMonday(monday: Date): Date {
  const e = new Date(monday);
  e.setDate(e.getDate() + 6);
  return e;
}

export function getThisWeekRange(reference = new Date()): { from: string; to: string } {
  const mon = startOfWeekMonday(reference);
  const sun = endOfWeekFromMonday(mon);
  return { from: toIsoLocal(mon), to: toIsoLocal(sun) };
}

export function getLastWeekRange(reference = new Date()): { from: string; to: string } {
  const thisMon = startOfWeekMonday(reference);
  const lastMon = new Date(thisMon);
  lastMon.setDate(lastMon.getDate() - 7);
  const lastSun = endOfWeekFromMonday(lastMon);
  return { from: toIsoLocal(lastMon), to: toIsoLocal(lastSun) };
}

export function getThisMonthRange(reference = new Date()): { from: string; to: string } {
  const y = reference.getFullYear();
  const m = reference.getMonth();
  const from = new Date(y, m, 1, 12, 0, 0, 0);
  const to = new Date(y, m + 1, 0, 12, 0, 0, 0);
  return { from: toIsoLocal(from), to: toIsoLocal(to) };
}

export function getLastMonthRange(reference = new Date()): { from: string; to: string } {
  const y = reference.getFullYear();
  const m = reference.getMonth();
  const from = new Date(y, m - 1, 1, 12, 0, 0, 0);
  const to = new Date(y, m, 0, 12, 0, 0, 0);
  return { from: toIsoLocal(from), to: toIsoLocal(to) };
}

/** Inclusive; returns [] if range invalid after normalizing order. */
export function enumerateIsoDatesInclusive(fromIso: string, toIso: string): string[] {
  const a = parseIsoLocal(fromIso);
  const b = parseIsoLocal(toIso);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return [];
  const start = a <= b ? a : b;
  const end = a <= b ? b : a;
  const out: string[] = [];
  const cur = new Date(start);
  while (cur <= end) {
    out.push(toIsoLocal(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return out;
}

export function formatDayHeading(iso: string): string {
  const d = parseIsoLocal(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatRangeHeading(fromIso: string, toIso: string): string {
  const from = parseIsoLocal(fromIso);
  const to = parseIsoLocal(toIso);
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return "Selected range";
  if (fromIso === toIso) return formatDayHeading(fromIso);
  const a = from <= to ? from : to;
  const b = from <= to ? to : from;
  const sameYear = a.getFullYear() === b.getFullYear();
  const optsShort: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    ...(sameYear ? {} : { year: "numeric" }),
  };
  const left = a.toLocaleDateString("en-GB", optsShort);
  const right = b.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return `${left} – ${right}`;
}
