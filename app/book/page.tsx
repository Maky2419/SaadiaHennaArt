"use client";

import Link from "next/link";
import { useState } from "react";

export default function BookPage() {
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setOk(null);
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const payload = {
      fullName: String(fd.get("fullName") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      eventType: String(fd.get("eventType") || ""),
      location: String(fd.get("location") || ""),
      notes: String(fd.get("notes") || ""),
      startIso: String(fd.get("startIso") || ""),
      endIso: String(fd.get("endIso") || ""),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Vancouver",
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Failed to submit request");

      setOk("Request sent! You’ll get an email once Saadia confirms your booking.");
      (e.target as HTMLFormElement).reset();
    } catch (ex: any) {
      setErr(ex?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="main">
      <div className="sectionHead">
        <h1 className="h2" style={{ fontSize: 32 }}>Book an appointment</h1>
        <p className="sub">
          Fill this out and Saadia will confirm by email.
          {" "}
          <Link className="navLink" href="/">Back to Home</Link>
        </p>
      </div>

      <form className="card" onSubmit={onSubmit} style={{ maxWidth: 820 }}>
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
            <label className="label">Phone (optional)</label>
            <input className="input" name="phone" />
          </div>

          <div className="field">
            <label className="label">Type *</label>
            <select className="input" name="eventType" required defaultValue="">
              <option value="" disabled>Select…</option>
              <option value="Event">Event</option>
              <option value="Private">Private</option>
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

          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label className="label">Location (optional)</label>
            <input className="input" name="location" placeholder="e.g., UBCO, Kelowna" />
          </div>

          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label className="label">Notes (optional)</label>
            <textarea className="input" name="notes" rows={4} placeholder="Design size, placement, inspo, etc." />
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 16, flexWrap: "wrap" }}>
          <button className="btnPrimary" disabled={loading} type="submit">
            {loading ? "Sending…" : "Request booking"}
          </button>
          {ok && <span className="muted">{ok}</span>}
          {err && <span style={{ color: "#7a1f1a", fontWeight: 800 }}>{err}</span>}
        </div>
      </form>
    </div>
  );
}
