import Link from "next/link";
import type { Metadata } from "next";
import { BrandLogo } from "@/components/BrandLogo";
import { WelcomeAnchorBridge } from "@/components/WelcomeAnchorBridge";

export const metadata: Metadata = {
  title: "Welcome to howl0 — Choose your language",
  description: "Choose English or Vietnamese to explore howl0.",
  robots: { index: false },
};

export default function WelcomePage() {
  return (
    <main id="main" className="welcome surface-noise">
      <WelcomeAnchorBridge />
      <div className="welcome-inner wrap">
        <BrandLogo className="welcome-logo" width={148} height={62} />
        <div className="welcome-content">
          <p className="eyebrow">MUSIC LEARNING, MADE VISIBLE</p>
          <h1>Welcome to howl0.</h1>
          <p className="welcome-prompt">
            Choose your language. <span lang="vi">Chọn ngôn ngữ của bạn.</span>
          </p>
          <nav className="welcome-choices" aria-label="Choose your language">
            <Link href="/choose-language/en" lang="en">
              <span>English</span>
              <span aria-hidden="true">↗</span>
            </Link>
            <Link href="/choose-language/vi" lang="vi" hrefLang="vi">
              <span>Tiếng Việt</span>
              <span aria-hidden="true">↗</span>
            </Link>
          </nav>
        </div>
        <p className="welcome-foot">
          Make the learning between lessons visible.
        </p>
      </div>
      <div className="welcome-signal" aria-hidden="true" />
    </main>
  );
}
