/* Native navigation executes the cookie-setting GET handler only on selection. */
/* eslint-disable @next/next/no-html-link-for-pages */
import type { Metadata } from "next";
import { BrandLogo } from "@/components/BrandLogo";
import { WelcomeAnchorBridge } from "@/components/WelcomeAnchorBridge";
import { ParaIcon } from "@/components/ParaIcon";

export const metadata: Metadata = {
  title: "Welcome to PARA — Choose your language",
  description: "Choose English or Vietnamese to explore PARA.",
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
          <h1>Welcome to PARA.</h1>
          <p className="welcome-prompt">
            Choose your language. <span lang="vi">Chọn ngôn ngữ của bạn.</span>
          </p>
          <nav className="welcome-choices" aria-label="Choose your language">
            <a href="/choose-language/en" lang="en">
              <span>English</span>
              <ParaIcon name="arrow-right" />
            </a>
            <a href="/choose-language/vi" lang="vi" hrefLang="vi">
              <span>Tiếng Việt</span>
              <ParaIcon name="arrow-right" />
            </a>
          </nav>
        </div>
        <p className="welcome-foot">
          Make the learning between lessons visible.
        </p>
      </div>
    </main>
  );
}
