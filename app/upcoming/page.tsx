"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type EventCategory = "Pop-up" | "Private" | "Workshop" | "Festival" | "Other";

type UpcomingEvent = {
  id: string;
  title: string;
  dateISO: string; // YYYY-MM-DD (local)
  startTime: string; // "18:00"
  endTime: string; // "21:00"
  location: string;
  city?: string;
  category: EventCategory;
  shortDesc: string;
  details: string[];
  price?: string;
  spots?: string;
  image?: string; // public path
  bookingHref?: string; // where you want users to go (can be /book)
};

const EVENTS: UpcomingEvent[] = [
  {
    id: "winter-pop-up-2026",
    title: "Winter Pop-Up Henna Booth",
    dateISO: "2026-01-17",
    startTime: "16:00",
    endTime: "20:00",
    location: "Student Union Building",
    city: "Kelowna",
    category: "Pop-up",
    shortDesc: "Walk-ins welcome. Mini + medium designs available.",
    details: [
      "Walk-ins welcome (first come, first served).",
      "Bring inspiration photos if you have a style in mind.",
      "Aftercare instructions provided on the spot.",
    ],
    price: "$10–$35",
    spots: "Walk-in",
    image: "/upcoming/upcoming-1.jpg",
    bookingHref: "/book",
  },
  {
    id: "mehndi-night-2026",
    title: "Mehndi Night (Pre-Event Booking)",
    dateISO: "2026-02-07",
    startTime: "17:00",
    endTime: "21:00",
    location: "Community Hall",
    city: "Kelowna",
    category: "Festival",
    shortDesc: "Book your slot ahead of time for smoother scheduling.",
    details: [
      "Pre-booking recommended (limited spots).",
      "Options: bridal-inspired, florals, minimal lines, mandalas.",
      "Please arrive 10 minutes early for check-in.",
    ],
    price: "Varies by design",
    spots: "Limited",
    image: "/upcoming/upcoming-2.jpg",
    bookingHref: "/book",
  },
  {
    id: "private-appointments-feb",
    title: "Private Appointments Week",
    dateISO: "2026-02-18",
    startTime: "12:00",
    endTime: "18:00",
    location: "By appointment (details after booking)",
    city: "Kelowna",
    category: "Private",
    shortDesc: "Personalized designs for birthdays, shoots, and events.",
    details: [
      "Best for detailed custom designs or matched sets with friends.",
      "Share inspiration + time range during booking request.",
      "I’ll confirm availability by email after you request.",
    ],
    price: "Quoted after request",
    spots: "Limited",
    image: "/upcoming/upcoming-3.jpg",
    bookingHref: "/book",
  },
];

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function formatDateNice(iso: string) {
  // parse as local date
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

function formatTime12h(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const dt = new Date();
  dt.setHours(h, m, 0, 0);
  return dt.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

function dateKeyMonth(iso: string) {
  const [y, m] = iso.split("-").map(Number);
  return `${y}-${pad2(m)}`;
}

function monthTitleFromKey(key: string) {
  const [y, m] = key.split("-").map(Number);
  const dt = new Date(y, m - 1, 1);
  return dt.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

function toICS(event: UpcomingEvent) {
  // Local time -> floating time (no TZ). Good enough for most personal calendars.
  const [y, mo, d] = event.dateISO.split("-").map(Number);
  const [sh, sm] = event.startTime.split(":").map(Number);
  const [eh, em] = event.endTime.split(":").map(Number);

  const dtStart = `${y}${pad2(mo)}${pad2(d)}T${pad2(sh)}${pad2(sm)}00`;
  const dtEnd = `${y}${pad2(mo)}${pad2(d)}T${pad2(eh)}${pad2(em)}00`;

  const uid = `${event.id}@saadia-henna-art`;
  const now = new Date();
  const dtStamp = `${now.getUTCFullYear()}${pad2(now.getUTCMonth() + 1)}${pad2(now.getUTCDate())}T${pad2(
    now.getUTCHours()
  )}${pad2(now.getUTCMinutes())}${pad2(now.getUTCSeconds())}Z`;

  const escape = (s: string) =>
    s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");

  const desc = escape([event.shortDesc, "", ...event.details].join("\n"));

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Saadia Henna Art//Upcoming Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${escape(event.title)}`,
    `LOCATION:${escape(event.location)}${event.city ? "\\, " + escape(event.city) : ""}`,
    `DESCRIPTION:${desc}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function googleCalendarLink(event: UpcomingEvent) {
  const [y, mo, d] = event.dateISO.split("-").map(Number);
  const [sh, sm] = event.startTime.split(":").map(Number);
  const [eh, em] = event.endTime.split(":").map(Number);

  // Treat as local and convert to ISO-like UTC-ish strings by using Date in local then toISOString
  const start = new Date(y, mo - 1, d, sh, sm, 0, 0);
  const end = new Date(y, mo - 1, d, eh, em, 0, 0);

  const toG = (dt: Date) => dt.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const dates = `${toG(start)}/${toG(end)}`;
  const text = encodeURIComponent(event.title);
  const details = encodeURIComponent([event.shortDesc, "", ...event.details].join("\n"));
  const location = encodeURIComponent(`${event.location}${event.city ? ", " + event.city : ""}`);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}&location=${location}`;
}

function EventBadge({ label }: { label: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: 999,
        padding: "6px 10px",
        fontSize: 12,
        fontWeight: 800,
        letterSpacing: 0.6,
        border: "1px solid rgba(0,0,0,0.14)",
        background: "rgba(255,255,255,0.25)",
        textTransform: "uppercase",
      }}
    >
      {label}
    </span>
  );
}

export default function UpcomingEventsPage() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<EventCategory | "All">("All");
  const [city, setCity] = useState<string>("All");
  const [view, setView] = useState<"List" | "Calendar">("List");

  const cities = useMemo(() => {
    const set = new Set<string>();
    EVENTS.forEach((e) => e.city && set.add(e.city));
    return ["All", ...Array.from(set).sort()];
  }, []);

  const categories: (EventCategory | "All")[] = ["All", "Pop-up", "Private", "Workshop", "Festival", "Other"];

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return EVENTS.filter((e) => {
      const matchesQ =
        !needle ||
        e.title.toLowerCase().includes(needle) ||
        e.shortDesc.toLowerCase().includes(needle) ||
        e.location.toLowerCase().includes(needle) ||
        (e.city ?? "").toLowerCase().includes(needle);

      const matchesCat = category === "All" || e.category === category;
      const matchesCity = city === "All" || (e.city ?? "") === city;

      return matchesQ && matchesCat && matchesCity;
    }).sort((a, b) => a.dateISO.localeCompare(b.dateISO));
  }, [q, category, city]);

  const groupedByMonth = useMemo(() => {
    const map = new Map<string, UpcomingEvent[]>();
    filtered.forEach((e) => {
      const key = dateKeyMonth(e.dateISO);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered]);

  const nextEvent = useMemo(() => {
    const now = new Date();
    const upcoming = EVENTS
      .map((e) => {
        const [y, m, d] = e.dateISO.split("-").map(Number);
        const [hh, mm] = e.startTime.split(":").map(Number);
        const dt = new Date(y, m - 1, d, hh, mm, 0, 0);
        return { e, dt };
      })
      .filter((x) => x.dt >= now)
      .sort((a, b) => a.dt.getTime() - b.dt.getTime());
    return upcoming[0]?.e ?? EVENTS.sort((a, b) => a.dateISO.localeCompare(b.dateISO))[0];
  }, []);

  const CalendarView = () => {
    // simple month blocks with days that have events
    const months = groupedByMonth.map(([k]) => k);

    return (
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 70px" }}>
        {months.length === 0 ? (
          <section className="card" style={{ margin: "16px auto 0", textAlign: "center" }}>
            <h2 className="h3" style={{ marginTop: 0 }}>
              No upcoming events match your filters
            </h2>
            <p style={{ marginBottom: 18, opacity: 0.9 }}>
              Try clearing filters or search for a different keyword.
            </p>
            <button
              type="button"
              className="btnPrim"
              onClick={() => {
                setQ("");
                setCategory("All");
                setCity("All");
              }}
            >
              Clear filters
            </button>
          </section>
        ) : null}

        {groupedByMonth.map(([monthKey, events]) => {
          const [yy, mm] = monthKey.split("-").map(Number);
          const first = new Date(yy, mm - 1, 1);
          const startDay = first.getDay(); // 0 Sun
          const daysInMonth = new Date(yy, mm, 0).getDate();

          const eventByDay = new Map<number, UpcomingEvent[]>();
          events.forEach((ev) => {
            const day = Number(ev.dateISO.split("-")[2]);
            if (!eventByDay.has(day)) eventByDay.set(day, []);
            eventByDay.get(day)!.push(ev);
          });

          const cells: (number | null)[] = [];
          for (let i = 0; i < startDay; i++) cells.push(null);
          for (let d = 1; d <= daysInMonth; d++) cells.push(d);

          return (
            <section key={monthKey} className="card" style={{ margin: "16px auto 0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <h2 className="h3" style={{ margin: 0 }}>
                  {monthTitleFromKey(monthKey)}
                </h2>
                <div style={{ opacity: 0.85, fontSize: 14 }}>
                  Tip: click a day with dots to jump to that event below.
                </div>
              </div>

              <div
                style={{
                  marginTop: 14,
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: 10,
                }}
              >
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <div
                    key={d}
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      letterSpacing: 1.1,
                      textTransform: "uppercase",
                      opacity: 0.75,
                      paddingLeft: 6,
                    }}
                  >
                    {d}
                  </div>
                ))}

                {cells.map((d, idx) => {
                  const dayEvents = d ? eventByDay.get(d) ?? [] : [];
                  const hasEvents = dayEvents.length > 0;

                  return (
                    <button
                      key={`${monthKey}-${idx}`}
                      type="button"
                      disabled={!hasEvents}
                      onClick={() => {
                        if (!hasEvents) return;
                        const targetId = dayEvents[0].id;
                        const el = document.getElementById(`event-${targetId}`);
                        el?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                      style={{
                        borderRadius: 14,
                        border: "1px solid rgba(0,0,0,0.10)",
                        background: hasEvents ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.12)",
                        minHeight: 64,
                        padding: "10px 10px",
                        textAlign: "left",
                        cursor: hasEvents ? "pointer" : "default",
                        opacity: d ? 1 : 0,
                        outline: "none",
                      }}
                      aria-label={d ? `Day ${d}${hasEvents ? ", has events" : ""}` : "Empty"}
                    >
                      {d ? (
                        <>
                          <div style={{ fontWeight: 900, fontSize: 14 }}>{d}</div>
                          {hasEvents ? (
                            <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                              {dayEvents.slice(0, 3).map((ev) => (
                                <span
                                  key={ev.id}
                                  style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: 999,
                                    background: "rgba(59,42,34,0.55)",
                                    display: "inline-block",
                                  }}
                                />
                              ))}
                              {dayEvents.length > 3 ? (
                                <span style={{ fontSize: 12, opacity: 0.8 }}>+{dayEvents.length - 3}</span>
                              ) : null}
                            </div>
                          ) : null}
                        </>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}

        {/* The same list appears below calendar, for full details */}
        <div style={{ marginTop: 18 }}>{/* list rendered below */}</div>
      </div>
    );
  };

  return (
    <main className="main">
      {/* Top header (your existing style/classes) */}
      <header className="header">
        <div className="headerInner">
          <div className="brandLeft" style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div className="brandLogoImg">
              <Image
                src="/logo.jpg"
                alt="Saadia's Henna Art logo"
                fill
                priority
                sizes="56px"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="brandTitle">Saadia Henna Art</div>
          </div>
        </div>

        <nav className="navRow" aria-label="Primary navigation">
          <div className="navInner">
            <a className="navLink" href="/">
              Home
            </a>
            <a className="navLink" href="/designs">
              Designs
            </a>
            <a className="navLink" href="/history">
              History of Events
            </a>
            <a className="navLink" href="/upcoming">
              Events to come
            </a>
            <a className="navLink" href="/book">
              Book an appointment
            </a>
            <a className="navLink" href="/about">
              About me
            </a>
           
          </div>
        </nav>
      </header>

      {/* Intro */}
      <section className="sectionHead" style={{ marginBottom: 10 }}>
        <h1 className="h2">Events to Come</h1>
        <p className="sub">
          Browse upcoming pop-ups, private appointment weeks, and special events. You can filter, search, and add
          events to your calendar.
        </p>
      </section>

      {/* Highlight (next event) */}
      {nextEvent ? (
        <section className="card" style={{ maxWidth: 1200, margin: "0 auto 14px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: nextEvent.image ? "1.1fr 1fr" : "1fr",
              gap: 18,
              alignItems: "center",
            }}
          >
            {nextEvent.image ? (
              <div
                style={{
                  borderRadius: 18,
                  overflow: "hidden",
                  border: "1px solid rgba(0,0,0,0.10)",
                  boxShadow: "0 12px 28px rgba(0,0,0,0.10)",
                }}
              >
                <div style={{ position: "relative", width: "100%", aspectRatio: "16/10" }}>
                  <Image src={nextEvent.image} alt={nextEvent.title} fill style={{ objectFit: "cover" }} />
                </div>
              </div>
            ) : null}

            <div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <EventBadge label="Next up" />
                <EventBadge label={nextEvent.category} />
              </div>

              <h2 className="h3" style={{ margin: "10px 0 6px" }}>
                {nextEvent.title}
              </h2>

              <div style={{ opacity: 0.88, fontWeight: 700 }}>
                {formatDateNice(nextEvent.dateISO)} • {formatTime12h(nextEvent.startTime)} –{" "}
                {formatTime12h(nextEvent.endTime)}
              </div>

              <div style={{ marginTop: 8, opacity: 0.9 }}>
                {nextEvent.location}
                {nextEvent.city ? `, ${nextEvent.city}` : ""}
              </div>

              <p style={{ marginTop: 12, marginBottom: 14, opacity: 0.92 }}>{nextEvent.shortDesc}</p>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <a className="btnPrim" href={nextEvent.bookingHref ?? "/book"}>
                  Request a booking
                </a>

                <a
                  className="navLink"
                  href={googleCalendarLink(nextEvent)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    border: "1px solid rgba(0,0,0,0.14)",
                    borderRadius: 10,
                    padding: "10px 12px",
                    textDecoration: "none",
                    fontWeight: 800,
                    letterSpacing: 0.6,
                  }}
                >
                  Add to Google Calendar
                </a>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Sticky Filters + View Toggle */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: "rgba(245, 236, 216, 0.92)",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "10px 24px",
            display: "grid",
            gridTemplateColumns: "1fr 170px 170px 220px",
            gap: 10,
            alignItems: "center",
          }}
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search events (title, location, city)…"
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.14)",
              background: "rgba(255,255,255,0.30)",
              outline: "none",
            }}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.14)",
              background: "rgba(255,255,255,0.30)",
              outline: "none",
              fontWeight: 700,
            }}
            aria-label="Filter by category"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === "All" ? "All categories" : c}
              </option>
            ))}
          </select>

          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.14)",
              background: "rgba(255,255,255,0.30)",
              outline: "none",
              fontWeight: 700,
            }}
            aria-label="Filter by city"
          >
            {cities.map((c) => (
              <option key={c} value={c}>
                {c === "All" ? "All locations" : c}
              </option>
            ))}
          </select>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={() => setView("List")}
              style={{
                borderRadius: 999,
                padding: "10px 12px",
                border: "1px solid rgba(0,0,0,0.14)",
                background: view === "List" ? "rgba(59,42,34,0.10)" : "rgba(255,255,255,0.25)",
                cursor: "pointer",
                fontWeight: 900,
                letterSpacing: 0.6,
              }}
            >
              List
            </button>
            <button
              type="button"
              onClick={() => setView("Calendar")}
              style={{
                borderRadius: 999,
                padding: "10px 12px",
                border: "1px solid rgba(0,0,0,0.14)",
                background: view === "Calendar" ? "rgba(59,42,34,0.10)" : "rgba(255,255,255,0.25)",
                cursor: "pointer",
                fontWeight: 900,
                letterSpacing: 0.6,
              }}
            >
              Calendar
            </button>
            <button
              type="button"
              onClick={() => {
                setQ("");
                setCategory("All");
                setCity("All");
              }}
              style={{
                borderRadius: 12,
                padding: "10px 12px",
                border: "1px solid rgba(0,0,0,0.14)",
                background: "rgba(255,255,255,0.25)",
                cursor: "pointer",
                fontWeight: 900,
                letterSpacing: 0.6,
              }}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Small responsive fallback */}
        <style jsx>{`
          @media (max-width: 980px) {
            div[style*="grid-template-columns: 1fr 170px 170px 220px"] {
              grid-template-columns: 1fr;
            }
            div[style*="justify-content: flex-end"] {
              justify-content: flex-start !important;
              flex-wrap: wrap;
            }
          }
        `}</style>
      </div>

      {/* Optional calendar */}
      {view === "Calendar" ? <CalendarView /> : null}

      {/* List (always useful; even in Calendar view we still show full details) */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 70px" }}>
        {filtered.length === 0 ? (
          <section className="card" style={{ margin: "16px auto 0", textAlign: "center" }}>
            <h2 className="h3" style={{ marginTop: 0 }}>
              No upcoming events found
            </h2>
            <p style={{ marginBottom: 18, opacity: 0.9 }}>
              Try a different search or clear filters to see everything.
            </p>
            <button
              type="button"
              className="btnPrim"
              onClick={() => {
                setQ("");
                setCategory("All");
                setCity("All");
              }}
            >
              Clear filters
            </button>
          </section>
        ) : null}

        {groupedByMonth.map(([monthKey, events]) => (
          <div key={monthKey} style={{ marginTop: 18 }}>
            <h2
              style={{
                margin: "10px 0 8px",
                fontSize: 22,
                fontWeight: 900,
                letterSpacing: 0.6,
                opacity: 0.95,
              }}
            >
              {monthTitleFromKey(monthKey)}
            </h2>

            {events.map((e) => {
              const ics = toICS(e);
              const icsHref = `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;

              return (
                <section
                  key={e.id}
                  id={`event-${e.id}`}
                  className="card"
                  style={{ margin: "14px auto 0" }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: e.image ? "340px 1fr" : "1fr",
                      gap: 18,
                      alignItems: "center",
                    }}
                  >
                    {e.image ? (
                      <div
                        style={{
                          borderRadius: 18,
                          overflow: "hidden",
                          border: "1px solid rgba(0,0,0,0.10)",
                          boxShadow: "0 12px 28px rgba(0,0,0,0.10)",
                        }}
                      >
                        <div style={{ position: "relative", width: "100%", aspectRatio: "4/3" }}>
                          <Image src={e.image} alt={e.title} fill style={{ objectFit: "cover" }} />
                        </div>
                      </div>
                    ) : null}

                    <div>
                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                        <EventBadge label={e.category} />
                        {e.spots ? <EventBadge label={e.spots} /> : null}
                        {e.price ? <EventBadge label={e.price} /> : null}
                      </div>

                      <h3 className="h3" style={{ margin: "10px 0 6px" }}>
                        {e.title}
                      </h3>

                      <div style={{ opacity: 0.88, fontWeight: 800 }}>
                        {formatDateNice(e.dateISO)} • {formatTime12h(e.startTime)} – {formatTime12h(e.endTime)}
                      </div>

                      <div style={{ marginTop: 6, opacity: 0.9 }}>
                        {e.location}
                        {e.city ? `, ${e.city}` : ""}
                      </div>

                      <p style={{ marginTop: 12, marginBottom: 12, opacity: 0.92 }}>{e.shortDesc}</p>

                      <details style={{ marginTop: 10 }}>
                        <summary style={{ cursor: "pointer", fontWeight: 900, letterSpacing: 0.4 }}>
                          More details
                        </summary>
                        <ul style={{ marginTop: 10, paddingLeft: 18, opacity: 0.95 }}>
                          {e.details.map((d, idx) => (
                            <li key={idx} style={{ marginBottom: 6 }}>
                              {d}
                            </li>
                          ))}
                        </ul>
                      </details>

                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
                        <a className="btnPrim" href={e.bookingHref ?? "/book"}>
                          Request booking
                        </a>

                        <a
                          href={icsHref}
                          download={`${e.title.replace(/[^\w]+/g, "_")}.ics`}
                          style={{
                            border: "1px solid rgba(0,0,0,0.14)",
                            borderRadius: 10,
                            padding: "10px 12px",
                            textDecoration: "none",
                            fontWeight: 900,
                            letterSpacing: 0.6,
                          }}
                        >
                          Download .ics
                        </a>

                        <a
                          href={googleCalendarLink(e)}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            border: "1px solid rgba(0,0,0,0.14)",
                            borderRadius: 10,
                            padding: "10px 12px",
                            textDecoration: "none",
                            fontWeight: 900,
                            letterSpacing: 0.6,
                          }}
                        >
                          Add to Google Calendar
                        </a>

                        <button
                          type="button"
                          onClick={async () => {
                            const url =
                              typeof window !== "undefined"
                                ? `${window.location.origin}/upcoming#event-${e.id}`
                                : `/upcoming#event-${e.id}`;
                            try {
                              await navigator.clipboard.writeText(url);
                              alert("Event link copied!");
                            } catch {
                              // fallback
                              prompt("Copy this link:", url);
                            }
                          }}
                          style={{
                            border: "1px solid rgba(0,0,0,0.14)",
                            borderRadius: 10,
                            padding: "10px 12px",
                            background: "rgba(255,255,255,0.25)",
                            cursor: "pointer",
                            fontWeight: 900,
                            letterSpacing: 0.6,
                          }}
                        >
                          Share
                        </button>
                      </div>
                    </div>
                  </div>

                  <style jsx>{`
                    @media (max-width: 900px) {
                      section[id^="event-"] > div {
                        grid-template-columns: 1fr !important;
                      }
                    }
                  `}</style>
                </section>
              );
            })}
          </div>
        ))}

        {/* Bottom CTA */}
        <section className="card" style={{ margin: "22px auto 0", textAlign: "center" }}>
          <h2 className="h3" style={{ marginTop: 0 }}>
            Don’t see the date you need?
          </h2>
          <p style={{ marginBottom: 18, opacity: 0.9 }}>
            You can still request a private appointment — I’ll confirm availability by email.
          </p>
          <a className="btnPrim" href="/book">
            Request a booking
          </a>
        </section>
      </div>
    </main>
  );
}
