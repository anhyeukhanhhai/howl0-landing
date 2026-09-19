import Link from "next/link";
import { HeroLoopPreview } from "@/components/HeroLoopPreview";
import { BeliefMoment } from "@/components/BeliefMoment";
import { PlatformReveal } from "@/components/PlatformReveal";
import { SubmissionFlow } from "@/components/SubmissionFlow";
import { WaitlistSection } from "@/components/WaitlistSection";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Music learning beyond the lesson",
  "howl0 is a learning platform in development for music education, starting with a simple submission link.",
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
              THE LEARNING PLATFORM BUILT FOR MUSIC EDUCATION
            </p>
            <h1>
              Music learning doesn’t stop when the <em>lesson ends.</em>
            </h1>
            <p className="hero-lead">
              howl0 helps teachers and students keep practice, homework and
              feedback connected—starting with one simple submission link.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/#waitlist">
                Join the waitlist <span aria-hidden="true">↗</span>
              </Link>
              <a className="text-link" href="#submission-flow">
                See the submission flow <span aria-hidden="true">↘</span>
              </a>
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
      <SubmissionFlow />
      <BeliefMoment compact />
      <PlatformReveal />
      <WaitlistSection />
    </main>
  );
}
