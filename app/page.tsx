"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="site">
      {/* Announcement bar */}
      <div className="announceBar">
        <div className="announceInner">
          <span className="announceText">
            ✦ Now booking events + private appointments ✦ Book to reserve your spot ✦
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="header">
        <div className="headerInner">
          <div
            className="brandLeft"
            style={{ display: "flex", alignItems: "center", gap: 14 }}
          >
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
            <div className="brandTitle">Saadia&apos;s Henna Art</div>
          </div>
        </div>

        <nav className="navRow" aria-label="Primary navigation">
          <div className="navInner">
            <a className="navLink" href="/">Home</a>
            <a className="navLink" href="/designs">Designs</a>
            <a className="navLink" href="/history">History of Events</a>
            <a className="navLink" href="/book">Book an appointment</a>
            <a className="navLink" href="/about">About me</a>
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="heroImg">
          <Image
            src="/designs/floral-1.jpeg"
            alt="Henna design on hand"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>

        <div className="heroOverlay">
          <div className="heroContent">
            <h1 className="heroH1">Henna for Events & Private Appointments</h1>
            <p className="heroP">
              Clean, detailed designs — from minimal florals to full hands.
            </p>

            <div className="heroCtas">
              <Link href="/book" className="btnPrimary">
                Go to Booking Page
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <section className="featureStrip">
        <div className="featureInner">
          <div className="featureItem">
            <div className="featureIcon">✦</div>
            <div className="featureText">
              <div className="featureTitle">Event-friendly</div>
              <div className="featureSub">Fast, clean lines for high-volume booths.</div>
            </div>
          </div>

          <div className="featureItem">
            <div className="featureIcon">✦</div>
            <div className="featureText">
              <div className="featureTitle">Quality paste</div>
              <div className="featureSub">For deep stains with proper aftercare.</div>
            </div>
          </div>

          <div className="featureItem">
            <div className="featureIcon">✦</div>
            <div className="featureText">
              <div className="featureTitle">DM support</div>
              <div className="featureSub">Questions? Message before booking.</div>
            </div>
          </div>
        </div>
      </section>

      {/* BODY */}
      <main className="main">
        {/* Aftercare + Booking side-by-side */}
        <section className="section">
          <div className="aftercareBookingGrid">
            {/* Aftercare */}
            <div className="card">
              <h2 className="h2">Henna Aftercare</h2>
              <p className="h3">Do this for the darkest, longest-lasting stain.</p>

              <ul className="list">
                <li>
                  <span className="bullet" /> Keep paste on for at least 1 hour (longer = darker).
                </li>
                <li>
                  <span className="bullet" /> Avoid water for 24 hours after removal.
                </li>
                <li>
                  <span className="bullet" /> Let it dry, then peel off — don’t wash.
                </li>
                <li>
                  <span className="bullet" /> Apply natural oils for a darker stain.
                </li>
                <li>
                  <span className="bullet" /> Color deepens over 24–48 hours.
                </li>
              </ul>
            </div>

            {/* Booking */}
            <div className="card">
              <h2 className="h2">Book an appointment</h2>

              <div className="priceRow">
                <div className="priceBox">
                  <div className="priceLabel">Events</div>
                  <div className="priceValue">$25 / hour</div>
                </div>

                <div className="priceBox">
                  <div className="priceLabel">Private</div>
                  <div className="priceValue">$7–15 / design</div>
                </div>
              </div>

              <p className="muted">
                Include: date, time, event/private, design size, placement.
              </p>

              <Link href="/book" className="btnPrimary">
                Book an appointment
              </Link>
            </div>
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
          {/* Logo */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Image
              src="/logo.jpg"
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

            <p style={{ marginTop: 14, opacity: 0.85 }}>@saadias_henna_art</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footerInner">
          <div className="footerName">Saadia Henna Art</div>
          <div className="tiny muted">© {new Date().getFullYear()}</div>
        </div>
      </footer>
    </div>
  );
}