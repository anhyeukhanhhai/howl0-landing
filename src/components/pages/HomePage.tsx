import Link from "next/link";
import { HeroLoopPreview } from "@/components/HeroLoopPreview";
import { BeliefMoment } from "@/components/BeliefMoment";
import { PerspectiveSwitcher } from "@/components/PerspectiveSwitcher";
import { SubmissionFlow } from "@/components/SubmissionFlow";
import { WaitlistSection } from "@/components/WaitlistSection";
import { content, localePath, type Locale } from "@/lib/i18n";

export function HomePage({ locale }: { locale: Locale }) {
  const dictionary = content[locale];
  const hero = dictionary.home.hero;
  return (
    <main id="main" className="page-enter">
      <section id="top" className="hero home-hero surface-noise">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <p className="eyebrow status">{hero.eyebrow}</p>
            <h1>{hero.title}</h1>
            <p className="hero-lead">{hero.intro}</p>
            <div className="hero-actions">
              <Link
                className="button button-primary"
                href={`${localePath(locale, "/")}#waitlist`}
              >
                {hero.primary} <span aria-hidden="true">↗</span>
              </Link>
              <Link
                className="text-link"
                href={localePath(locale, "/how-it-works")}
              >
                {hero.secondary} <span aria-hidden="true">↘</span>
              </Link>
            </div>
            <p className="development-label">{hero.status}</p>
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
            <HeroLoopPreview
              stages={hero.stages}
              parentView={hero.parentView}
              visualMessage={hero.visualMessage}
              aria={hero.aria}
            />
          </div>
        </div>
      </section>
      <SubmissionFlow content={dictionary.home.loop} />
      <PerspectiveSwitcher
        locale={locale}
        content={dictionary.home.perspectives}
      />
      <BeliefMoment content={dictionary.belief} compact />
      <WaitlistSection locale={locale} />
    </main>
  );
}
