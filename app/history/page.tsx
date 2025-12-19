"use client";

import Image from "next/image";

type EventImage = {
  src: string;
  alt: string;
};

type PastEvent = {
  id: string;
  year: number;
  title: string;
  date: string;
  location?: string;
  description: string;
  images: EventImage[];
};

const EVENTS: PastEvent[] = [
  {
    id: "spring-festival-2025",
    year: 2025,
    title: "Spring Festival Henna Booth",
    date: "April 2025",
    location: "UBC Okanagan",
    description:
      "A busy spring event with lots of walk-in designs, florals, vines, and quick mini pieces. I focused on clean linework and fast-drying finishes for high traffic.",
    images: [
      { src: "/events/spring-festival-2025-1.jpg", alt: "Spring Festival henna 1" },
      { src: "/events/spring-festival-2025-2.jpg", alt: "Spring Festival henna 2" },
      { src: "/events/spring-festival-2025-3.jpg", alt: "Spring Festival henna 3" },
      { src: "/events/spring-festival-2025-4.jpg", alt: "Spring Festival henna 4" },
    ],
  },
  {
    id: "mehndi-night-2025",
    year: 2025,
    title: "Mehndi Night",
    date: "March 2025",
    location: "Kelowna",
    description:
      "A classic mehndi night with detailed bridal-inspired patterns, mandalas, and mixed styles. I made sure the designs photographed beautifully under warm lighting.",
    images: [
      { src: "/events/mehndi-night-2025-1.jpg", alt: "Mehndi Night henna 1" },
      { src: "/events/mehndi-night-2025-2.jpg", alt: "Mehndi Night henna 2" },
      { src: "/events/mehndi-night-2025-3.jpg", alt: "Mehndi Night henna 3" },
    ],
  },
  {
    id: "culture-night-2024",
    year: 2024,
    title: "Culture Night Pop-Up",
    date: "October 2024",
    location: "UBC Okanagan",
    description:
      "A pop-up henna table featuring minimalist designs and medium-complexity pieces for attendees who wanted something elegant and wearable.",
    images: [
      { src: "/events/culture-night-2024-1.jpg", alt: "Culture Night henna 1" },
      { src: "/events/culture-night-2024-2.jpg", alt: "Culture Night henna 2" },
      { src: "/events/culture-night-2024-3.jpg", alt: "Culture Night henna 3" },
    ],
  },
  {
    id: "wrc-mehndi-2024",
    year: 2024,
    title: "WRC Mehndi Event",
    date: "September 2024",
    location: "Women’s Resource Centre",
    description:
      "A warm, community-based event where I did a mix of quick designs and detailed pieces. This one was all about creating an inviting experience and giving people options at different time lengths.",
    images: [
      { src: "/events/wrc-mehndi-2024-1.jpg", alt: "WRC mehndi henna 1" },
      { src: "/events/wrc-mehndi-2024-2.jpg", alt: "WRC mehndi henna 2" },
    ],
  },
];

function groupByYear(events: PastEvent[]) {
  const map = new Map<number, PastEvent[]>();
  for (const e of events) {
    if (!map.has(e.year)) map.set(e.year, []);
    map.get(e.year)!.push(e);
  }
  // newest year first
  return Array.from(map.entries()).sort((a, b) => b[0] - a[0]);
}

function EventCard({ event }: { event: PastEvent }) {
  return (
    <section className="card" style={{ margin: "18px auto 0" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
          alignItems: "baseline",
          marginBottom: 12,
        }}
      >
        <h2 className="h3" style={{ margin: 0 }}>
          {event.title}
        </h2>

        <div style={{ opacity: 0.85, fontSize: 14 }}>
          <span style={{ fontWeight: 600 }}>{event.date}</span>
          {event.location ? (
            <span style={{ marginLeft: 10 }}>• {event.location}</span>
          ) : null}
        </div>
      </div>

      <p style={{ marginTop: 0, marginBottom: 16, opacity: 0.92 }}>
        {event.description}
      </p>

      {/* Images grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: 12,
        }}
      >
        {event.images.map((img, idx) => (
          <div
            key={`${event.id}-${idx}`}
            style={{
              gridColumn: "span 6",
              borderRadius: 16,
              overflow: "hidden",
              border: "1px solid rgba(0,0,0,0.10)",
              boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
              background: "rgba(255,255,255,0.25)",
            }}
          >
            <div style={{ position: "relative", width: "100%", aspectRatio: "4/3" }}>
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 900px) 100vw, 600px"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Mobile: make images 1 per row */}
      <style jsx>{`
        @media (max-width: 850px) {
          div[style*="grid-template-columns: repeat(12, 1fr)"] > div {
            grid-column: span 12 !important;
          }
        }
      `}</style>
    </section>
  );
}

export default function HistoryPage() {
  const grouped = groupByYear(EVENTS);

  return (
    <main className="main">
      {/* TOP HEADER (same as your layout) */}
      <header className="header">
        <div className="headerInner">
          <div className="brandLeft">
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
            <a className="navLink" href="/">Home</a>
            <a className="navLink" href="/designs">Designs</a>
            <a className="navLink" href="/history">History of Events</a>
            <a className="navLink" href="/upcoming">Events to come</a>
            <a className="navLink" href="/book">Book an appointment</a>
            <a className="navLink" href="/about">About me</a>
            <a className="navLink" href="/contact">Contact</a>
          </div>
        </nav>
      </header>

      {/* Page intro */}
      <section className="sectionHead" style={{ marginBottom: 10 }}>
        <h1 className="h2">History of Events</h1>
        <p className="sub">
          A timeline of past events, pop-ups, and appointments — with photos from each.
        </p>
      </section>

      {/* Long page content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 60px" }}>
        {grouped.map(([year, events]) => (
          <div key={year} style={{ marginTop: 24 }}>
            <h2
              style={{
                margin: "10px 0 8px",
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: 0.5,
                opacity: 0.95,
              }}
            >
              {year}
            </h2>

            {events.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        ))}

        {/* Bottom CTA */}
        <section className="card" style={{ margin: "28px auto 0" }}>
          <h2 className="h3" style={{ marginTop: 0 }}>
            Want to book for your event?
          </h2>
          <p style={{ marginBottom: 18, opacity: 0.9 }}>
            Private appointments and event bookings are available. Click below to request a booking.
          </p>
          <a className="btnPrim" href="/book">
            Book an appointment
          </a>
        </section>
      </div>
    </main>
  );
}
