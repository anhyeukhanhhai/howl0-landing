import "../para.css";
import { BrandHead } from "@/components/BrandHead";
import { Navigation } from "@/components/Navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { content } from "@/lib/i18n";
import { siteMetadata } from "@/lib/metadata";

export const metadata = siteMetadata("vi");
export { siteViewport as viewport } from "@/lib/viewport";

export default function VietnameseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" data-scroll-behavior="smooth">
      <head>
        <BrandHead />
      </head>
      <body>
        <a className="skip-link" href="#main">
          {content.vi.skip}
        </a>
        <Navigation locale="vi" />
        {children}
        <SiteFooter locale="vi" />
      </body>
    </html>
  );
}
