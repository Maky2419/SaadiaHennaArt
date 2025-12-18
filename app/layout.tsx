import "./globals.css";

export const metadata = {
  title: "Saadia Henna Art",
  description: "A minimal Next.js frontend running in Docker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          {children}
        </div>
      </body>
    </html>
  );
}
