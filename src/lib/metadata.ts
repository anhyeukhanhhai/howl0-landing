import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export function pageMetadata(
  title: string,
  description: string,
  path: string,
  home = false,
): Metadata {
  const fullTitle = home ? `howl0 — ${title}` : `${title} — howl0`;
  const canonical = siteUrl ? new URL(path, siteUrl).toString() : undefined;
  return {
    title: home ? { absolute: fullTitle } : title,
    description,
    ...(canonical ? { alternates: { canonical } } : {}),
    openGraph: {
      title: fullTitle,
      description,
      type: "website",
      ...(canonical ? { url: canonical } : {}),
    },
    twitter: {
      card: "summary",
      title: fullTitle,
      description,
    },
  };
}
