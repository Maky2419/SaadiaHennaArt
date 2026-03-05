"use client";

import Image from "next/image";
import { useState } from "react";

type BookingType = "" | "Event" | "Private";
type PrivateLocation = "" | "Commons" | "Kelowna Islamic Centre";

export default function BookPage() {
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // NEW: control conditional fields
  const [bookingType, setBookingType] = useState<BookingType>("");
  const [privateLocation, setPrivateLocation] = useState<PrivateLocation>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setOk(null);
    setLoading(true);

    try {
      const formEl = e.currentTarget;
      const fd = new FormData(formEl);

      // Add timezone client-side
      fd.set(
        "timezone",
        Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Vancouver"
      );

      const res = await fetch("/api/bookings", {
        method: "POST",
        body: fd, // send as multipart/form-data automatically
      });

      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Failed to submit request");

      setOk("Request sent! You’ll get an email confirmation of your booking soon.");
      formEl.reset();

      // reset controlled fields
      setBookingType("");
      setPrivateLocation("");
    } catch (ex: any) {
      setErr(ex?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const isEvent = bookingType === "Event";
  const isPrivate = bookingType === "Private";

  return (
    <main className="main">
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

      <section className="sectionHead">
        <h1 className="h2" style={{ fontSize: 32 }}>
          Book an appointment
        </h1>
        <p className="sub"></p>
      </section>

      <form
        className="card"
        onSubmit={onSubmit}
        style={{ maxWidth: 820, margin: "0 auto" }}
      >
        <div className="formGrid">
          <div className="field">
            <label className="label">Full name *</label>
            <input className="input" name="fullName" required />
          </div>

          <div className="field">
            <label className="label">Email *</label>
            <input className="input" name="email" type="email" required />
          </div>

          <div className="field">
            <label className="label">Instagram Handle</label>
            {/* keep backend name as "phone" so no DB/schema change needed */}
            <input className="input" name="phone" placeholder="@yourhandle" />
          </div>

          <div className="field">
            <label className="label">Type *</label>
            <select
              className="input"
              name="eventType"
              required
              value={bookingType}
              onChange={(e) => {
                const v = (e.target.value || "") as BookingType;
                setBookingType(v);
                // reset dependent state when switching
                if (v !== "Private") setPrivateLocation("");
              }}
            >
              <option value="" disabled>
                Select…
              </option>
              <option value="Event">Event - $25/hour</option>
              <option value="Private">Private appointment - $7-$15</option>
            </select>
          </div>

          <div className="field">
            <label className="label">Start time *</label>
            <input className="input" name="startIso" type="datetime-local" required />
          </div>

          <div className="field">
            <label className="label">End time *</label>
            <input className="input" name="endIso" type="datetime-local" required />
          </div>

          {/* EVENT: location is free-text */}
          {isEvent && (
            <div className="field" style={{ gridColumn: "1 / -1" }}>
              <label className="label">Location in Kelowna *</label>
              <input
                className="input"
                name="location"
                placeholder="e.g., UBCO, Downtown, etc."
                required
              />
            </div>
          )}

          {/* PRIVATE: location is dropdown with 2 options */}
          {isPrivate && (
            <div className="field" style={{ gridColumn: "1 / -1" }}>
              <label className="label">Location *</label>
              <select
                className="input"
                name="privateLocation"
                required
                value={privateLocation}
                onChange={(e) => setPrivateLocation(e.target.value as PrivateLocation)}
              >
                <option value="" disabled>
                  Select…
                </option>
                <option value="Commons">UBCO campus in the Commons building</option>
                <option value="Kelowna Islamic Centre">Kelowna Islamic Centre</option>
              </select>
            </div>
          )}

          {/* BOTH (Event + Private): attendees required */}
          {(isEvent || isPrivate) && (
            <div className="field" style={{ gridColumn: "1 / -1" }}>
              <label className="label">Number of attendees *</label>
              <input
                className="input"
                name="attendees"
                type="number"
                min={1}
                step={1}
                required
                placeholder="e.g., 1"
              />
            </div>
          )}

          {/* EVENT ONLY: booth setup details */}
          {isEvent && (
            <div className="field" style={{ gridColumn: "1 / -1" }}>
              <label className="label">
                Do you have a henna booth already set up? Provide details of arrangements *
              </label>
              <textarea
                className="input"
                name="boothDetails"
                rows={4}
                required
                placeholder="At minimum: table + 2 chairs. Mention booth setup details + expected flow, etc."
              />
            </div>
          )}

          {/* NOTES (optional) — always shown */}
          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label className="label">Notes (optional)</label>
            <textarea
              className="input"
              name="notes"
              rows={4}
              placeholder="Design size, placement, inspiration, etc."
            />
          </div>

          {/* Reference image (optional) */}
          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label className="label">Reference image (optional)</label>
            <input className="input" name="referenceImage" type="file" accept="image/*" />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            marginTop: 16,
            flexWrap: "wrap",
          }}
        >
          <button className="btnPrimary" disabled={loading} type="submit">
            {loading ? "Sending…" : "Request booking"}
          </button>
          {ok && <span className="muted">{ok}</span>}
          {err && <span style={{ color: "#7a1f1a", fontWeight: 800 }}>{err}</span>}
        </div>
      </form>
    </main>
  );
}