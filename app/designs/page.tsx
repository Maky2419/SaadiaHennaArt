"use client";

import Image from "next/image";
import { useMemo, useState, useEffect } from "react";

type StyleTag =
  | "Floral"
  | "Minimalistic"
  | "Mandala"
  | "Vines"
  | "Tattoo Style"
  | "Dome"
  | "Black Henna";

type Design = {
  id: string;
  price: number;
  tags: StyleTag[];
  image: string; // /public path
  note?: string;
};

const DESIGNS: Design[] = [
  { id: "blackhennadomevines", price: 10, tags: ["Black Henna","Dome","Vines"], image: "/designs/Blackhennadomevines.jpg" },

  { id: "blackhenna-minimalist-1", price: 10, tags: ["Black Henna","Minimalistic"], image: "/designs/BlackhennaMinimalist-1.jpg" },

  { id: "blackhenna-vines-1", price: 15, tags: ["Black Henna","Vines"], image: "/designs/BlackhennaVines-1.jpg" },

  { id: "blackhenna-vinesfloral-1", price: 10, tags: ["Black Henna","Floral","Vines"], image: "/designs/Blackhennavinesfloral-1.jpg" },

  { id: "blackhenna-vinesfloral-2", price: 10, tags: ["Black Henna","Floral","Vines"], image: "/designs/Blackhennavinesfloral-2.jpg" },

  { id: "dome-1", price: 10, tags: ["Dome"], image: "/designs/Dome-1.jpg" },

  { id: "floral-1", price: 7, tags: ["Floral"], image: "/designs/floral-1.jpg" },

  { id: "floral-2", price: 15, tags: ["Floral"], image: "/designs/floral-2.jpg" },

  { id: "floral-3", price: 10, tags: ["Floral"], image: "/designs/floral-3.jpg" },

  { id: "floral-4", price: 10, tags: ["Floral"], image: "/designs/floral-4.jpg" },

  { id: "floral-5", price: 10, tags: ["Floral"], image: "/designs/floral-5.jpg" },

  { id: "floral-6", price: 10, tags: ["Floral"], image: "/designs/floral-6.jpg" },

  { id: "floral-7", price: 10, tags: ["Floral"], image: "/designs/floral-7.jpg" },

  { id: "floral-dome-blackhenna", price: 15, tags: ["Floral","Dome","Black Henna"], image: "/designs/Floraldomeblackhenna-1.jpg" },

  { id: "floral-mandala-1", price: 15, tags: ["Floral","Mandala"], image: "/designs/floralMandala-1.jpg" },

  { id: "floral-mandala-vines-blackhenna", price: 15, tags: ["Floral","Mandala","Vines","Black Henna"], image: "/designs/Floralmandalavinesblackhenna-1.jpg" },

  { id: "minimalistic-1", price: 8, tags: ["Minimalistic"], image: "/designs/minimalistic-1.jpg" },

  { id: "minimalistic-2", price: 8, tags: ["Minimalistic"], image: "/designs/minimalistic-2.jpg" },

  { id: "minimalistic-3", price: 8, tags: ["Minimalistic"], image: "/designs/minimalistic-3.jpg" },

  { id: "minimalistic-vines-1", price: 8, tags: ["Minimalistic","Vines"], image: "/designs/MinimalisticVines-1.jpg" },

  { id: "simplistic-1", price: 8, tags: ["Minimalistic"], image: "/designs/simplistic-1.jpg" },

  { id: "tattoo-1", price: 8, tags: ["Tattoo Style"], image: "/designs/tattoo-1.jpg" },

  { id: "tattoo-2", price: 8, tags: ["Tattoo Style"], image: "/designs/tattoo-2.jpg" },

  { id: "tattoo-3", price: 8, tags: ["Tattoo Style"], image: "/designs/tattoo-3.jpg" },

  { id: "vines-1", price: 8, tags: ["Vines"], image: "/designs/Vines-1.jpg" },

  { id: "vines-2", price: 8, tags: ["Vines"], image: "/designs/Vines-2.jpg" },

  { id: "vines-dome-minimalistic-1", price: 8, tags: ["Vines","Dome","Minimalistic"], image: "/designs/Vinesdomeminimalistic-1.jpg" },
];

const ALL_TAGS: StyleTag[] = [
  "Floral",
  "Minimalistic",
  "Mandala",
  "Vines",
  "Tattoo Style",
  "Dome",
  "Black Henna",
];


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
          <div className="brandTitle">Saadia's Henna Art</div>
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

export default function DesignsPage() {
  const [q, setQ] = useState("");
  const [type, setType] = useState<StyleTag | "All">("All");
  const [maxPrice, setMaxPrice] = useState<number | "">("");

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

    return DESIGNS.filter((d) => {
      const matchesSearch =
        !needle ||
        d.id.toLowerCase().includes(needle) ||
        (d.note ?? "").toLowerCase().includes(needle) ||
        d.tags.some((t) => t.toLowerCase().includes(needle));

      const matchesType = type === "All" || d.tags.includes(type);

const matchesPrice = maxPrice === "" ? true : d.price <= maxPrice;
      return matchesSearch && matchesType && matchesPrice;
    });
  }, [q, type, maxPrice]);

  return (
    <main className="main">
      <TopHeader />

      <section className="sectionHead" style={{ marginBottom: 10 }}>
        <h1 className="h2">Designs</h1>
        <p className="sub">Click any image to view larger.</p>
      </section>

      {/* Filters */}
      <div style={{ maxWidth: 1800, margin: "0 auto", padding: "10px 16px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 220px 150px",
            gap: 10,
            alignItems: "center",
          }}
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search…"
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
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.14)",
              background: "rgba(255,255,255,0.30)",
              outline: "none",
              fontWeight: 800,
            }}
            aria-label="Filter by design type"
          >
            <option value="All">All types</option>
            {ALL_TAGS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="Max $"
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.14)",
              background: "rgba(255,255,255,0.30)",
              outline: "none",
              fontWeight: 800,
            }}
            aria-label="Max price"
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
          <button
            type="button"
            onClick={() => {
              setQ("");
              setType("All");
              setMaxPrice("");
            }}
            style={{
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
            div[style*="grid-template-columns: 1fr 220px 150px"] {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>

      {/* Gallery */}
      <div style={{ maxWidth: 1800, margin: "0 auto", padding: "8px 16px 40px" }}>
        {filtered.length === 0 ? (
          <div style={{ padding: 18, borderRadius: 16, border: "1px solid rgba(0,0,0,0.12)" }}>
            <div style={{ fontWeight: 900, marginBottom: 8 }}>No designs match your filters</div>
            <button
              type="button"
              onClick={() => {
                setQ("");
                setType("All");
                setMaxPrice("");
              }}
              style={{
                borderRadius: 10,
                padding: "10px 12px",
                border: "1px solid rgba(0,0,0,0.14)",
                background: "rgba(255,255,255,0.25)",
                cursor: "pointer",
                fontWeight: 900,
              }}
            >
              Reset
            </button>
          </div>
        ) : null}

        <div
          style={{
            marginTop: 14,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 10, // tighter
          }}
        >
          {filtered.map((d) => (
            <div
              key={d.id}
              style={{
                borderRadius: 18,
                overflow: "hidden",
                border: "1px solid rgba(0,0,0,0.10)",
                background: "rgba(255,255,255,0.18)",
              }}
            >
              {/* Big square image tile */}
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
                aria-label={`Open ${d.id}`}
              >
                <div style={{ position: "relative", width: "100%", aspectRatio: "1 / 1" }}>
                  <Image src={d.image} alt={`Henna design ${d.id}`} fill style={{ objectFit: "cover" }} />
                </div>
              </button>

              {/* Minimal info bar */}
              <div style={{ padding: 10, display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                <div style={{ fontWeight: 900, fontSize: 18 }}>
  ${d.price}
</div>

                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {d.tags.slice(0, 2).map((t) => (
                    <span
                      key={t}
                      style={{
                        fontSize: 12,
                        fontWeight: 900,
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

                <div style={{ width: "100%", display: "flex", gap: 10, marginTop: 6, flexWrap: "wrap" }}>
                  <a className="btnPrim" href={`/book?design=${encodeURIComponent(d.id)}`}>
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
                    }}
                  >
                    Share
                  </button>
                </div>

                {d.note ? <div style={{ width: "100%", marginTop: 6, opacity: 0.9, fontSize: 13 }}>{d.note}</div> : null}
              </div>
            </div>
          ))}
        </div>

        {/* Responsive */}
        <style jsx>{`
          @media (max-width: 1100px) {
            div[style*="grid-template-columns: repeat(3"] {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
          @media (max-width: 700px) {
            div[style*="grid-template-columns: repeat(3"] {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
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
            zIndex: 9999,
            background: "rgba(0,0,0,0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 18,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(1100px, 96vw)",
              borderRadius: 18,
              overflow: "hidden",
              background: "rgba(255,255,255,0.98)",
              border: "1px solid rgba(255,255,255,0.18)",
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
  ${lightbox.price} • {lightbox.tags.join(", ")}
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

            <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 10" }}>
              <Image src={lightbox.image} alt={`Henna design ${lightbox.id}`} fill style={{ objectFit: "contain" }} />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}