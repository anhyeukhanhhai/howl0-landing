import "../globals.css";
import "../scroll.css";
import "../responsive-motion.css";
import "../multi-page.css";
import "../theme.css";
import "@fontsource/archivo/400.css";
import "@fontsource/archivo/600.css";
import "@fontsource/archivo/700.css";
import "@fontsource/be-vietnam-pro/400.css";
import "@fontsource/be-vietnam-pro/500.css";
import "@fontsource/be-vietnam-pro/600.css";
import { Navigation } from "@/components/Navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { content } from "@/lib/i18n";
import { siteMetadata } from "@/lib/metadata";

export const metadata = siteMetadata("en");
export { siteViewport as viewport } from "@/lib/viewport";

export default function EnglishLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#main">
          {content.en.skip}
        </a>
        <Navigation locale="en" />
        {children}
        <SiteFooter locale="en" />
      </body>
    </html>
  );
}
