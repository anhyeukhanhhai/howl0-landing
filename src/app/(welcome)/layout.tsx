import "../para.css";
import { BrandHead } from "@/components/BrandHead";

export { siteViewport as viewport } from "@/lib/viewport";

export default function WelcomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <BrandHead />
      </head>
      <body>{children}</body>
    </html>
  );
}
