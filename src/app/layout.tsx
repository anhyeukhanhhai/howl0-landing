import type { Metadata, Viewport } from "next";
import "./globals.css";
import "@fontsource/archivo/400.css";
import "@fontsource/archivo/600.css";
import "@fontsource/archivo/700.css";
import "@fontsource/be-vietnam-pro/400.css";
import "@fontsource/be-vietnam-pro/500.css";
import "@fontsource/be-vietnam-pro/600.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
export const metadata: Metadata = {
  ...(siteUrl
    ? { metadataBase: new URL(siteUrl), alternates: { canonical: siteUrl } }
    : {}),
  title: "howl0 — Music homework, one simple link",
  description:
    "howl0 is building a calmer way for music teachers to share practice, students to submit recordings, and families to stay connected to progress.",
  openGraph: {
    title: "howl0 — Music homework, one simple link",
    description: "One link. A clearer practice loop.",
    type: "website",
    ...(siteUrl
      ? { images: [`${siteUrl}/brand/howl0/02-symbols/howl0-app-icon-512.png`] }
      : {}),
  },
  twitter: {
    card: "summary",
    title: "howl0 — Music homework, one simple link",
    description: "One link. A clearer practice loop.",
  },
  icons: {
    icon: "/brand/howl0/02-symbols/howl0-favicon-32.png",
    apple: "/brand/howl0/02-symbols/howl0-apple-touch-icon-180.png",
  },
};
export const viewport: Viewport = {
  themeColor: "#FFF7F2",
  width: "device-width",
  initialScale: 1,
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
