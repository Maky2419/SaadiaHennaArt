"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type StyleTag = "Minimal" | "Floral" | "Bridal" | "Arabic" | "Indo-Pak" | "Mandalas" | "Modern";

type Design = {
  id: string;
  title: string;
  priceFrom: number;
  priceTo: number;
  timeMins: number; // estimated
  tags: StyleTag[];
  image: string; // /public path
  note?: string;
  createdISO?: string; // optional for "newest"
};

const DESIGNS: Design[] = [
  {
    id: "mini-floral-1",
    title: "Mini Floral Vine",
    priceFrom: 10,
    priceTo: 15,
    timeMins: 10,
    tags: ["Floral", "Minimal"],
    image: "/designs/mini-floral-1.jpg",
    createdISO: "2025-11-15",
    note: "Perfect for quick walk-ins.",
  },
  {
    id: "mandala-1",
    title: "Mandalas + Dotwork",
    priceFrom: 20,
    priceTo: 30,
    timeMins: 20,
    tags: ["Mandalas", "Modern"],
    image: "/designs/mandala-1.jpg",
    createdISO: "2025-10-22",
  },
  {
    id: "arabic-sweep-1",
    title: "Arabic Sweep",
    priceFrom: 25,
    priceTo: 40,
    timeMins: 25,
    tags: ["Arabic", "Floral"],
    image: "/designs/arabic-sweep-1.jpg",
    createdISO: "2025-09-05",
  },
  {
    id: "bridal-hand-1",
    title: "Bridal Hand (Detailed)",
    priceFrom: 70,
    priceTo: 120,
    timeMins: 75,
    tags: ["Bridal", "Indo-Pak", "Floral"],
    image: "/designs/bridal-hand-1.jpg",
    createdISO: "2025-08-18",
    note: "Best booked in advance.",
  },
];

const ALL_TAGS: StyleTag[] = ["Minimal", "Floral", "Bridal", "Arabic", "Indo-Pak", "Mandalas", "Modern"];

function formatPriceRange(a: number, b: number) {
  return a === b ? `$${a}` : `$${a}–$${b}`;
}

function TopHeader() {
  return (
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
  );
}

function TagPill({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        borderRadius: 999,
        padding: "8px 12px",
        border: "1px solid rgba(0,0,0,0.14)",
        background: active ? "rgba(59,42,34,0.12)" : "rgba(255,255,255,0.25)",
        cursor: "pointer",
        fontWeight: 900,
        letterSpacing: 0.5,
        fontSize: 12,
      }}
    >
      {label}
    </button>
  );
}

export default function DesignsPage() {
  const [q, setQ] = useState("");
  const [tag, setTag] = useState<StyleTag | "All">("All");
  const [sort, setSort] = useState<"Recommended" | "PriceLow" | "PriceHigh" | "Newest">("Recommended");
  const [lightbox, setLightbox] = useState<Design | null>(null);

  // ESC closes lightbox
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();

    let list = DESIGNS.filter((d) => {
      const matchesQ =
        !needle ||
        d.title.toLowerCase().includes(needle) ||
        (d.note ?? "").toLowerCase().includes(needle) ||
        d.tags.some((t) => t.toLowerCase().includes(needle));

      const matchesTag = tag === "All" || d.tags.includes(tag);

      return matchesQ && matchesTag;
    });

    if (sort === "PriceLow") list = list.sort((a, b) => a.priceFrom - b.priceFrom);
    if (sort === "PriceHigh") list = list.sort((a, b) => b.priceTo - a.priceTo);
    if (sort === "Newest") list = list.sort((a, b) => (b.createdISO ?? "").localeCompare(a.createdISO ?? ""));

    // Recommended: keep default order, but put bridal slightly later for casual browsing
    if (sort === "Recommended") {
      list = list.sort((a, b) => {
        const ba = a.tags.includes("Bridal") ? 1 : 0;
        const bb = b.tags.includes("Bridal") ? 1 : 0;
        return ba - bb;
      });
    }

    return list;
  }, [q, tag, sort]);

  return (
    <main className="main">
      <TopHeader />

      <section className="sectionHead" style={{ marginBottom: 10 }}>
        <h1 className="h2">Designs</h1>
        <p className="sub">Browse design samples, prices, and time estimates. Click any photo to zoom.</p>
      </section>

      {/* Sticky filters */}
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
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "10px 24px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 190px 210px",
              gap: 10,
              alignItems: "center",
            }}
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search designs (floral, bridal, mandala…)…"
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
              value={tag}
              onChange={(e) => setTag(e.target.value as any)}
              style={{
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid rgba(0,0,0,0.14)",
                background: "rgba(255,255,255,0.30)",
                outline: "none",
                fontWeight: 800,
              }}
              aria-label="Filter by style"
            >
              <option value="All">All styles</option>
              {ALL_TAGS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              style={{
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid rgba(0,0,0,0.14)",
                background: "rgba(255,255,255,0.30)",
                outline: "none",
                fontWeight: 800,
              }}
              aria-label="Sort designs"
            >
              <option value="Recommended">Recommended</option>
              <option value="Newest">Newest</option>
              <option value="PriceLow">Price: Low → High</option>
              <option value="PriceHigh">Price: High → Low</option>
            </select>
          </div>

          {/* quick tags + clear */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10, alignItems: "center" }}>
            <TagPill active={tag === "All"} label="All" onClick={() => setTag("All")} />
            {ALL_TAGS.map((t) => (
              <TagPill key={t} active={tag === t} label={t} onClick={() => setTag(t)} />
            ))}

            <button
              type="button"
              onClick={() => {
                setQ("");
                setTag("All");
                setSort("Recommended");
              }}
              style={{
                marginLeft: "auto",
                borderRadius: 12,
                padding: "8px 12px",
                border: "1px solid rgba(0,0,0,0.14)",
                background: "rgba(255,255,255,0.25)",
                cursor: "pointer",
                fontWeight: 900,
                letterSpacing: 0.5,
              }}
            >
              Clear
            </button>
          </div>

          <style jsx>{`
            @media (max-width: 980px) {
              div[style*="grid-template-columns: 1fr 190px 210px"] {
                grid-template-columns: 1fr !important;
              }
            }
          `}</style>
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 70px" }}>
        {filtered.length === 0 ? (
          <section className="card" style={{ margin: "18px auto 0", textAlign: "center" }}>
            <h2 className="h3" style={{ marginTop: 0 }}>
              No designs match your filters
            </h2>
            <p style={{ marginBottom: 18, opacity: 0.9 }}>
              Try a different search or pick another style tag.
            </p>
            <button
              type="button"
              className="btnPrim"
              onClick={() => {
                setQ("");
                setTag("All");
                setSort("Recommended");
              }}
            >
              Reset filters
            </button>
          </section>
        ) : null}

        <div
          style={{
            marginTop: 18,
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: 14,
          }}
        >
          {filtered.map((d) => (
            <div
              key={d.id}
              id={d.id}
              className="card"
              style={{
                margin: 0,
                gridColumn: "span 4",
                overflow: "hidden",
                padding: 0,
              }}
            >
              {/* Image */}
              <button
                type="button"
                onClick={() => setLightbox(d)}
                style={{
                  border: "none",
                  background: "transparent",
                  padding: 0,
                  cursor: "pointer",
                  width: "100%",
                  display: "block",
                }}
                aria-label={`Open image: ${d.title}`}
              >
                <div style={{ position: "relative", width: "100%", aspectRatio: "4/3" }}>
                  <Image src={d.image} alt={d.title} fill style={{ objectFit: "cover" }} />
                </div>
              </button>

              {/* Content */}
              <div style={{ padding: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "start" }}>
                  <div>
                    <div style={{ fontWeight: 900, fontSize: 16 }}>{d.title}</div>
                    <div style={{ opacity: 0.85, fontWeight: 800, marginTop: 4 }}>
                      {formatPriceRange(d.priceFrom, d.priceTo)} • ~{d.timeMins} min
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
                  {d.tags.map((t) => (
                    <span
                      key={t}
                      style={{
                        fontSize: 12,
                        fontWeight: 900,
                        letterSpacing: 0.5,
                        padding: "6px 10px",
                        borderRadius: 999,
                        border: "1px solid rgba(0,0,0,0.12)",
                        background: "rgba(255,255,255,0.25)",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {d.note ? <div style={{ marginTop: 10, opacity: 0.9, fontSize: 13 }}>{d.note}</div> : null}

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
                  <a className="btnPrim" href={`/book?design=${encodeURIComponent(d.title)}`}>
                    Book this style
                  </a>

                  <button
                    type="button"
                    onClick={async () => {
                      const url =
                        typeof window !== "undefined"
                          ? `${window.location.origin}/designs#${d.id}`
                          : `/designs#${d.id}`;
                      try {
                        await navigator.clipboard.writeText(url);
                        alert("Design link copied!");
                      } catch {
                        prompt("Copy this link:", url);
                      }
                    }}
                    style={{
                      borderRadius: 10,
                      padding: "10px 12px",
                      border: "1px solid rgba(0,0,0,0.14)",
                      background: "rgba(255,255,255,0.25)",
                      cursor: "pointer",
                      fontWeight: 900,
                      letterSpacing: 0.5,
                    }}
                  >
                    Share
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Responsive columns */}
        <style jsx>{`
          @media (max-width: 1100px) {
            div[style*="grid-template-columns: repeat(12, 1fr)"] > div {
              grid-column: span 6 !important;
            }
          }
          @media (max-width: 700px) {
            div[style*="grid-template-columns: repeat(12, 1fr)"] > div {
              grid-column: span 12 !important;
            }
          }
        `}</style>

        {/* Bottom CTA */}
        <section className="card" style={{ margin: "22px auto 0", textAlign: "center" }}>
          <h2 className="h3" style={{ marginTop: 0 }}>
            Not sure what to pick?
          </h2>
          <p style={{ marginBottom: 18, opacity: 0.9 }}>
            Request a booking and mention your preferred style + time, and I’ll recommend options.
          </p>
          <a className="btnPrim" href="/book">
            Book an appointment
          </a>
        </section>
      </div>

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
              <div style={{ fontWeight: 900, opacity: 0.9 }}>
                {lightbox.title} • {formatPriceRange(lightbox.priceFrom, lightbox.priceTo)}
              </div>
              <button
                type="button"
                onClick={() => setLightbox(null)}
                style={{
                  border: "1px solid rgba(0,0,0,0.18)",
                  background: "rgba(245,236,216,0.9)",
                  borderRadius: 10,
                  padding: "6px 10px",
                  cursor: "pointer",
                  fontWeight: 900,
                }}
              >
                Close ✕
              </button>
            </div>

            <div style={{ position: "relative", width: "100%", aspectRatio: "16/10" }}>
              <Image src={lightbox.image} alt={lightbox.title} fill style={{ objectFit: "cover" }} />
            </div>

            <div style={{ padding: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a className="btnPrim" href={`/book?design=${encodeURIComponent(lightbox.title)}`}>
                Book this style
              </a>
              <a
                href="/book"
                style={{
                  border: "1px solid rgba(0,0,0,0.14)",
                  borderRadius: 10,
                  padding: "10px 12px",
                  textDecoration: "none",
                  fontWeight: 900,
                  letterSpacing: 0.5,
                }}
              >
                Request a custom design
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
