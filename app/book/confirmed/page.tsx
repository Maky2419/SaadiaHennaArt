import Link from "next/link";

export default function ConfirmedPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  return (
    <div className="main">
      <div className="card" style={{ maxWidth: 800 }}>
        <h1 className="h2" style={{ fontSize: 30 }}>Booking Confirmed ✅</h1>
        <p className="sub">
          The booking has been confirmed and emails were sent (with calendar invite).
        </p>
        {searchParams.id && (
          <p className="muted">Booking ID: <code>{searchParams.id}</code></p>
        )}
        <div style={{ marginTop: 14 }}>
          <Link className="btnGhost" href="/">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
