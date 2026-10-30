import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Unforgettable Tales | Luxury Digital Wedding Invitations Catalog",
  description: "Bespoke digital luxury wedding experiences and visual studio platform with 8 master architectural themes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/app.css" />
      </head>
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
