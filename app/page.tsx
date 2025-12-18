export default function Home() {
  return (
    <main className="card">
      <h1 className="title">Next.js Frontend (Dockerized)</h1>
      <p className="muted">
        Run it with <code>docker compose up --build</code> and open{" "}
        <code>http://localhost:3000</code>.
      </p>

      <section className="section">
        <h2>What’s included</h2>
        <ul>
          <li>Next.js App Router</li>
          <li>TypeScript</li>
          <li>Dockerfile + docker-compose (dev workflow)</li>
        </ul>
      </section>

      <section className="section">
        <h2>Next steps</h2>
        <ul>
          <li>Add pages under <code>/app</code></li>
          <li>Add API calls to your backend (if/when you have one)</li>
          <li>Switch compose command to <code>npm run start</code> for production</li>
        </ul>
      </section>
    </main>
  );
}
