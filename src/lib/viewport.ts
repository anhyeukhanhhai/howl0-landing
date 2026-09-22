import type { Viewport } from "next";

export const siteViewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFF7F2" },
    { media: "(prefers-color-scheme: dark)", color: "#2A1B22" },
  ],
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
};
