import { BeliefMoment } from "@/components/BeliefMoment";
import { PageCta } from "@/components/PageCta";
import { PageHero } from "@/components/PageHero";
import { ScatterSignal } from "@/components/ScatterSignal";
import { content, type Locale } from "@/lib/i18n";

export function WhyHowl0Page({ locale }: { locale: Locale }) {
  const dictionary = content[locale];
  const page = dictionary.why;
  return (
    <main id="main" className="page-enter">
      <PageHero
        eyebrow={page.eyebrow}
        title={page.title}
        intro={page.intro}
        tone="dark"
      />
      <section className="problem dark-section surface-noise section-pad">
        <div className="wrap problem-grid">
          <div>
            <h2>{page.missingTitle}</h2>
            <p className="section-copy">{page.missingCopy}</p>
          </div>
          <ScatterSignal locale={locale} />
        </div>
      </section>
      <BeliefMoment content={dictionary.belief} />
      <PageCta locale={locale} title={page.ctaTitle} />
    </main>
  );
}
