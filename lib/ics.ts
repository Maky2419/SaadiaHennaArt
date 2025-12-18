function pad(n: number) {
  return String(n).padStart(2, "0");
}

// Converts ISO -> UTC format YYYYMMDDTHHMMSSZ
function toUtcIcsDate(iso: string) {
  const d = new Date(iso);
  return (
    d.getUTCFullYear() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    "Z"
  );
}

export function makeIcs(opts: {
  uid: string;
  title: string;
  description?: string;
  location?: string;
  startIso: string;
  endIso: string;
}) {
  const dtstamp = toUtcIcsDate(new Date().toISOString());
  const dtstart = toUtcIcsDate(opts.startIso);
  const dtend = toUtcIcsDate(opts.endIso);

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Saadia Henna Art//Booking//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${opts.uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${dtstart}`,
    `DTEND:${dtend}`,
    `SUMMARY:${escapeIcs(opts.title)}`,
    opts.description ? `DESCRIPTION:${escapeIcs(opts.description)}` : "",
    opts.location ? `LOCATION:${escapeIcs(opts.location)}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);

  return lines.join("\r\n");
}

function escapeIcs(s: string) {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}
