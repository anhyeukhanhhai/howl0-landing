import type { Viewport } from "next";

export const siteViewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F3EDE2" },
    { media: "(prefers-color-scheme: dark)", color: "#3B2F2A" },
  ],
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
};
