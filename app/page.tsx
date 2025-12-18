"use client";

import Image from "next/image";

export default function Home() {
  return (
    <div className="site">
      {/* Announcement bar */}
      <div className="announceBar">
        <div className="announceInner">
          <span className="announceText">
            ✦ Now booking events + private appointments ✦ DM to reserve your spot ✦
          </span>
        </div>
      </div>

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

      {/* HERO */}
      <section className="hero">
        <div className="heroImg">
          <Image
            src="/hero.jpg"
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
              <a className="btnPrimary" href="/book">
                Book an appointment
              </a>
              <a className="btnGhost" href="#aftercare">
                Aftercare
              </a>
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
            <div className="featureFeatureText">
              <div className="featureTitle">DM support</div>
              <div className="featureSub">Questions? Message before booking.</div>
            </div>
          </div>
        </div>
      </section>

      {/* BODY */}
      <main className="main">
        {/* Photos */}
        <section className="section">
          <div className="sectionHead">
            <h2 className="h2">Designs</h2>
            <p className="sub">Replace these placeholders with your actual photos.</p>
          </div>

          <div className="photoGrid">
            <div className="photoCard">
              <div className="photoPh" />
              <div className="photoCap">Floral fine-line</div>
            </div>
            <div className="photoCard">
              <div className="photoPh" />
              <div className="photoCap">Minimal wrist</div>
            </div>
            <div className="photoCard">
              <div className="photoPh" />
              <div className="photoCap">Back-of-hand</div>
            </div>
            <div className="photoCard">
              <div className="photoPh" />
              <div className="photoCap">Arabic-inspired</div>
            </div>
            <div className="photoCard">
              <div className="photoPh" />
              <div className="photoCap">Full hand</div>
            </div>
            <div className="photoCard">
              <div className="photoPh" />
              <div className="photoCap">Custom design</div>
            </div>
          </div>
        </section>

        {/* Aftercare + Booking side-by-side */}
<section className="section">
  <div className="aftercareBookingGrid">

    {/* Aftercare */}
    <div className="card">
      <h2 className="h2">Henna Aftercare</h2>
      <p className="sub">Do this for the darkest, longest-lasting stain.</p>

      <ul className="list">
        <li><span className="bullet" /> Keep paste on for at least 1 hour (longer = darker).</li>
        <li><span className="bullet" /> Avoid water for 24 hours after removal.</li>
        <li><span className="bullet" /> Let it dry, then peel off — don’t wash.</li>
        <li><span className="bullet" /> Apply natural oils for a darker stain.</li>
        <li><span className="bullet" /> Color deepens over 24–48 hours.</li>
      </ul>
    </div>

    {/* Booking */}
    <div className="card">
      <h2 className="h2">Book an appointment</h2>
      <p className="sub">This button goes to a new page you’ll code later.</p>

      <div className="priceRow">
        <div className="priceBox">
          <div className="priceLabel">Events</div>
          <div className="priceValue">$22 / hour</div>
        </div>

        <div className="priceBox">
          <div className="priceLabel">Private</div>
          <div className="priceValue">$7–10 / design</div>
        </div>
      </div>

      <p className="muted">
        Include: date, time, event/private, design size, placement.
      </p>

      <a className="btnPrimary" href="/book">
        Go to Booking Page
      </a>

      <div className="tiny muted">(We’ll build /book later.)</div>
    </div>

  </div>
</section>

      </main>

      <footer className="footer">
        <div className="footerInner">
          <div className="footerName">Saadia Henna Art</div>
          <div className="tiny muted">© {new Date().getFullYear()}</div>
        </div>
      </footer>
    </div>
  );
}
