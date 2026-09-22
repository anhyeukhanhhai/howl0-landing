import type { Metadata } from "next";
import { content, localePath, type Locale } from "@/lib/i18n";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export function pageMetadata(
  title: string,
  description: string,
  path: string,
  locale: Locale = "en",
  home = false,
): Metadata {
  const localizedPath = localePath(locale, path);
  const fullTitle = home ? content[locale].metadata.title : `${title} — howl0`;
  const canonical = siteUrl
    ? new URL(localizedPath, siteUrl).toString()
    : undefined;
  const english = siteUrl ? new URL(path, siteUrl).toString() : undefined;
  const vietnamese = siteUrl
    ? new URL(localePath("vi", path), siteUrl).toString()
    : undefined;
  return {
    title: home ? { absolute: fullTitle } : title,
    description,
    ...(canonical
      ? {
          alternates: {
            canonical,
            languages: { en: english!, vi: vietnamese! },
          },
        }
      : {}),
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

export function siteMetadata(locale: Locale): Metadata {
  const dictionary = content[locale];
  return {
    ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
    title: {
      default: dictionary.metadata.title,
      template: `%s — howl0`,
    },
    description: dictionary.metadata.description,
    openGraph: {
      title: dictionary.metadata.title,
      description: dictionary.metadata.description,
      type: "website",
      locale: locale === "vi" ? "vi_VN" : "en_AU",
      ...(siteUrl
        ? {
            images: [
              `${siteUrl}/brand/howl0/02-symbols/howl0-app-icon-512.png`,
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary",
      title: dictionary.metadata.title,
      description: dictionary.metadata.description,
    },
    icons: {
      icon: "/brand/howl0/02-symbols/howl0-favicon-32.png",
      apple: "/brand/howl0/02-symbols/howl0-apple-touch-icon-180.png",
    },
  };
}
