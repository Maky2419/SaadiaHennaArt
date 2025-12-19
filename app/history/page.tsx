"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type EventImage = { src: string; alt: string };

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
      "A busy spring event with lots of walk-in designs — florals, vines, and quick mini pieces. Clean linework and fast-drying finishes for high traffic.",
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
      "A classic mehndi night with detailed bridal-inspired patterns, mandalas, and mixed styles. Designed to photograph beautifully under warm lighting.",
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
      "A pop-up henna table featuring minimalist designs and medium-complexity pieces — elegant, wearable, and quick to apply.",
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
      "A community-based event with a mix of quick designs and detailed pieces. The goal was to make henna approachable with options for different time lengths.",
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
  return Array.from(map.entries()).sort((a, b) => b[0] - a[0]);
}

function TopHeader() {
  return (
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
  );
}

function EventCard({
  event,
  onImageClick,
}: {
  event: PastEvent;
  onImageClick: (img: EventImage) => void;
}) {
  return (
    <section className="card" style={{ margin: "16px auto 0" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
          alignItems: "baseline",
          marginBottom: 10,
        }}
      >
        <h2 className="h3" style={{ margin: 0 }}>
          {event.title}
        </h2>

        <div style={{ opacity: 0.85, fontSize: 14 }}>
          <span style={{ fontWeight: 700 }}>{event.date}</span>
          {event.location ? <span style={{ marginLeft: 10 }}>• {event.location}</span> : null}
        </div>
      </div>

      <p style={{ marginTop: 0, marginBottom: 16, opacity: 0.92 }}>
        {event.description}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: 12,
        }}
      >
        {event.images.map((img, idx) => (
          <button
            key={`${event.id}-${idx}`}
            type="button"
            onClick={() => onImageClick(img)}
            style={{
              gridColumn: "span 6",
              borderRadius: 16,
              overflow: "hidden",
              border: "1px solid rgba(0,0,0,0.10)",
              boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
              background: "rgba(255,255,255,0.20)",
              padding: 0,
              cursor: "pointer",
              transition: "transform 150ms ease, box-shadow 150ms ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 18px 35px rgba(0,0,0,0.12)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0px)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 10px 25px rgba(0,0,0,0.08)";
            }}
            aria-label={`Open image: ${img.alt}`}
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
          </button>
        ))}
      </div>

      {/* Mobile: 1 per row */}
      <style jsx>{`
        @media (max-width: 850px) {
          button[style*="grid-column: span 6"] {
            grid-column: span 12 !important;
          }
        }
      `}</style>
    </section>
  );
}

export default function HistoryPage() {
  const grouped = useMemo(() => groupByYear(EVENTS), []);
  const years = useMemo(() => grouped.map(([y]) => y), [grouped]);

  const yearRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [showTop, setShowTop] = useState(false);
  const [lightbox, setLightbox] = useState<EventImage | null>(null);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 550);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const scrollToYear = (year: number) => {
    const el = yearRefs.current[year];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="main">
      <TopHeader />

      {/* Sticky Jump Bar */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
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
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div style={{ fontWeight: 800, letterSpacing: 0.6 }}>
            Jump to year:
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {years.map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => scrollToYear(y)}
                style={{
                  border: "1px solid rgba(0,0,0,0.18)",
                  background: "rgba(255,255,255,0.35)",
                  borderRadius: 999,
                  padding: "6px 12px",
                  cursor: "pointer",
                  fontWeight: 700,
                  letterSpacing: 0.4,
                }}
              >
                {y}
              </button>
            ))}
          </div>

          <a className="btnPrim" href="/book" style={{ textDecoration: "none" }}>
            Book an appointment
          </a>
        </div>
      </div>

      {/* Page intro */}
      <section className="sectionHead" style={{ marginBottom: 6 }}>
        <h1 className="h2">History of Events</h1>
        <p className="sub">
          A timeline of past events, pop-ups, and appointments — click photos to view larger.
        </p>
      </section>

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 70px" }}>
        {grouped.map(([year, events]) => (
          <div
            key={year}
            ref={(el) => {
              yearRefs.current[year] = el;
            }}
            style={{ marginTop: 22 }}
          >
            <h2
              style={{
                margin: "10px 0 8px",
                fontSize: 22,
                fontWeight: 900,
                letterSpacing: 0.6,
                opacity: 0.95,
              }}
            >
              {year}
            </h2>

            {events.map((e) => (
              <EventCard key={e.id} event={e} onImageClick={(img) => setLightbox(img)} />
            ))}
          </div>
        ))}

        {/* Bottom CTA */}
        <section className="card" style={{ margin: "26px auto 0" }}>
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

      {/* Back to top button */}
      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{
            position: "fixed",
            right: 18,
            bottom: 18,
            zIndex: 40,
            borderRadius: 999,
            border: "1px solid rgba(0,0,0,0.18)",
            background: "rgba(245, 236, 216, 0.95)",
            padding: "10px 14px",
            cursor: "pointer",
            fontWeight: 800,
            boxShadow: "0 12px 30px rgba(0,0,0,0.16)",
          }}
          aria-label="Back to top"
        >
          ↑ Top
        </button>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 60,
            background: "rgba(0,0,0,0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 18,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(980px, 96vw)",
              borderRadius: 18,
              overflow: "hidden",
              background: "rgba(255,255,255,0.98)",
              border: "1px solid rgba(0,0,0,0.12)",
              boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
            }}
          >
            <div
              style={{
                padding: "10px 14px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid rgba(0,0,0,0.08)",
              }}
            >
              <div style={{ fontWeight: 800, opacity: 0.85 }}>{lightbox.alt}</div>
              <button
                type="button"
                onClick={() => setLightbox(null)}
                style={{
                  border: "1px solid rgba(0,0,0,0.18)",
                  background: "rgba(245,236,216,0.9)",
                  borderRadius: 10,
                  padding: "6px 10px",
                  cursor: "pointer",
                  fontWeight: 800,
                }}
              >
                Close ✕
              </button>
            </div>

            <div style={{ position: "relative", width: "100%", aspectRatio: "16/10" }}>
              <Image
                src={lightbox.src}
                alt={lightbox.alt}
                fill
                sizes="(max-width: 900px) 100vw, 980px"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
