import Link from "next/link";
import { HeroLoopPreview } from "@/components/HeroLoopPreview";
import { OneLinkSummary } from "@/components/OneLinkSummary";
import { WaitlistSection } from "@/components/WaitlistSection";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Music homework, one simple link",
  "A calmer way for music teachers to share practice and students to submit recordings through one simple link.",
  "/",
  true,
);

export default function Home() {
  return (
    <main id="main" className="page-enter">
      <section id="top" className="hero home-hero surface-noise">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <p className="eyebrow status">
              <span className="status-dot" /> Currently in development · Join
              our early community
            </p>
            <h1>
              Music homework,
              <br /> <em>shared and submitted</em>
              <br /> in one simple link<span className="period">.</span>
            </h1>
            <p className="hero-lead">
              A calmer way to assign practice, submit recordings and keep
              feedback connected. One link keeps everyone in the loop.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/#waitlist">
                Join the waitlist <span aria-hidden="true">↗</span>
              </Link>
              <Link className="text-link" href="/how-it-works">
                See how it works <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-loop">
              <img
                src="/brand/howl0/02-symbols/howl0-return-loop-master.svg"
                alt=""
                fetchPriority="high"
                aria-hidden="true"
              />
            </div>
            <HeroLoopPreview />
          </div>
        </div>
        <div className="hero-baseline wrap" aria-hidden="true">
          <span>SHARE</span>
          <div className="baseline-line" />
          <span>IMPROVE</span>
        </div>
      </section>
      <OneLinkSummary />
      <WaitlistSection />
    </main>
  );
}
