/** Consultations are booked in Georgia local time (no DST). */
export const TBILISI_UTC_OFFSET_HOURS = 4;
export const CONSULT_MINUTES = 15;

export type CalendarEvent = {
  title: string;
  description: string;
  date: string;
  time: string;
  durationMinutes?: number;
  url?: string;
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function wallStamp(date: string, time: string, extraMinutes = 0) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const start = Date.UTC(
    year ?? 0,
    (month ?? 1) - 1,
    day ?? 1,
    hour ?? 0,
    minute ?? 0,
    0
  );
  const at = new Date(start + extraMinutes * 60_000);
  return (
    `${at.getUTCFullYear()}${pad(at.getUTCMonth() + 1)}${pad(at.getUTCDate())}` +
    `T${pad(at.getUTCHours())}${pad(at.getUTCMinutes())}00`
  );
}

function utcStamp(date: string, time: string, extraMinutes = 0) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const start = Date.UTC(
    year ?? 0,
    (month ?? 1) - 1,
    day ?? 1,
    (hour ?? 0) - TBILISI_UTC_OFFSET_HOURS,
    minute ?? 0,
    0
  );
  const at = new Date(start + extraMinutes * 60_000);
  return (
    `${at.getUTCFullYear()}${pad(at.getUTCMonth() + 1)}${pad(at.getUTCDate())}` +
    `T${pad(at.getUTCHours())}${pad(at.getUTCMinutes())}00Z`
  );
}

function fold(line: string) {
  return line.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,");
}

export function buildIcs(event: CalendarEvent) {
  const minutes = event.durationMinutes ?? CONSULT_MINUTES;
  const start = utcStamp(event.date, event.time);
  const end = utcStamp(event.date, event.time, minutes);
  const stamp = new Date()
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
  const uid = `${start}-${fold(event.title).slice(0, 24)}@lawmarket.ge`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Law Market//Consult//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${fold(event.title)}`,
    `DESCRIPTION:${fold(event.description)}`,
    "LOCATION:Law Market",
    event.url ? `URL:${event.url}` : null,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);

  return lines.join("\r\n");
}

export function googleCalendarUrl(event: CalendarEvent) {
  const minutes = event.durationMinutes ?? CONSULT_MINUTES;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${wallStamp(event.date, event.time)}/${wallStamp(event.date, event.time, minutes)}`,
    details: event.description,
    location: "Law Market",
    ctz: "Asia/Tbilisi",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadIcs(event: CalendarEvent, filename = "law-market-consult.ics") {
  const blob = new Blob([buildIcs(event)], {
    type: "text/calendar;charset=utf-8",
  });
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(href), 1000);
}
