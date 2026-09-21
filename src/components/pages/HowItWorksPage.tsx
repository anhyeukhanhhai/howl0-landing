import { PageCta } from "@/components/PageCta";
import { PageHero } from "@/components/PageHero";
import { PracticeLoop } from "@/components/PracticeLoop";
import { content, type Locale } from "@/lib/i18n";

export function HowItWorksPage({ locale }: { locale: Locale }) {
  const page = content[locale].howItWorks;
  return (
    <main id="main" className="page-enter">
      <PageHero eyebrow={page.eyebrow} title={page.title} intro={page.intro}>
        <div className="page-signal-mark" aria-hidden="true">
          <img
            src="/brand/howl0/02-symbols/howl0-return-loop-master.svg"
            alt=""
          />
          <span>howl0.link/practice ↗</span>
        </div>
      </PageHero>
      <PracticeLoop content={page} />
      <section className="flow-next section-pad">
        <div className="wrap flow-next-inner">
          <h2>{page.differentiator}</h2>
          <p className="simple-flow">{page.simpleFlow}</p>
          <p>{page.note}</p>
        </div>
      </section>
      <PageCta locale={locale} title={page.ctaTitle} />
    </main>
  );
}
