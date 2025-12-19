"use client";

import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    
    <main className="main">

         {/* Header */}
 {/* Header */}
      <header className="header">
        <div className="headerInner">
          {/* Left side (optional placeholder to keep layout balanced) */}
          <div className="headerSide" />

          {/* Center brand (logo + title) */}
          <div className="brandCenter">
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

          {/* Right side (empty to keep layout balanced) */}
          <div className="headerSide headerSideRight" />
        </div>

        {/* Nav row */}
        <nav className="navRow" aria-label="Primary navigation">
          <div className="navInner">
            <a className="navLink" href="/">Home</a>
            <a className="navLink" href="/designs">Designs</a>
            <a className="navLink" href="/history">History of Events</a>
            <a className="navLink" href="/upcoming">Events to come</a>
            <a className="navLink" href="/book">Book an apointment</a>
            <a className="navLink" href="/about">About me</a>
            <a className="navLink" href="/contact">Contact</a>
          </div>
        </nav>
      </header>

      {/* Header */}
      <section className="sectionHead">
        <h1 className="h2">About Me</h1>
        <p className="sub">A little about the artist behind the designs.</p>

      </section>

      {/* Bio Section */}
      <section
        className="card"
        style={{
          maxWidth: 900,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "320px 1fr",
          gap: 32,
          alignItems: "center",
        }}
      >
        {/* Saadia Photo */}
        <div
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  }}
>
          <Image
            src="/saadia.jpg"
            alt="Saadia – Henna Artist"
            width={300}
            height={300}
            priority
            style={{
              borderRadius: "50%",
              objectFit: "cover",
              boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
            }}
          />
          <p style={{ marginTop: 14, opacity: 0.85 }}>
            Saadia — Henna Artist
          </p>
        </div>

        {/* Bio Text */}
        <div>
          <p style={{ marginBottom: 16 }}>
            Hi! I’m <strong>Saadia</strong>, the artist behind{" "}
            <strong>Saadia’s Henna Art</strong>.
          </p>

          <p style={{ marginBottom: 16 }}>
            Henna has always been more than just body art to me — it’s a way of
            expressing culture, creativity, and personal stories through
            intricate designs. I specialize in clean, elegant patterns ranging
            from minimal everyday designs to detailed pieces for events and
            celebrations.
          </p>

          <p style={{ marginBottom: 16 }}>
            Whether it’s for a special occasion or simply because you love the
            art, I put care and intention into every design to make sure each
            piece feels unique and meaningful.
          </p>

          <p style={{ marginBottom: 0 }}>
            I’m based locally and available for both private appointments and
            events.
          </p>
        </div>
      </section>

      {/* Instagram / Branding Section */}
      <section
        className="card"
        style={{
          maxWidth: 900,
          margin: "48px auto 0",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          alignItems: "center",
          gap: 32,
        }}
      >
        {/* Circular Logo */}
        <div
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  }}
>
          <Image
            src="/logo.png"
            alt="Saadia’s Henna Art Logo"
            width={280}
            height={280}
        
          />
        </div>

        {/* Instagram CTA */}
        <div>
          <h2 className="h3" style={{ marginBottom: 12 }}>
            Follow my work on Instagram
          </h2>

          <p style={{ marginBottom: 24 }}>
            See my latest designs, past events, and recent henna work.
          </p>

          <a
            href="https://www.instagram.com/saadias_henna_art/"
            target="_blank"
            rel="noopener noreferrer"
            className="btnPrim"
          >
            Visit Instagram Page
          </a>

          <p style={{ marginTop: 14, opacity: 0.85 }}>
            @saadias_henna_art
          </p>
        </div>
      </section>
    </main>
  );
}
