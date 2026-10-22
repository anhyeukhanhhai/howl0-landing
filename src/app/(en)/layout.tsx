import "../para.css";
import { BrandHead } from "@/components/BrandHead";
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
      <head>
        <BrandHead />
      </head>
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
