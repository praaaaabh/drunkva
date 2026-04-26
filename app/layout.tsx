import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Drunkva | Social night-out tracker",
  description:
    "A playful, responsible way to track nights out, venues, spend, friends, and personal stats."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
