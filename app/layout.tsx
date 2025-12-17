import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lydia Studio Resources",
  description: "A curated menu of tools, practices, and supports for focus, time awareness, and learning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
