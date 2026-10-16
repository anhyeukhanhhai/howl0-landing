import { PageCta } from "@/components/PageCta";
import { PageHero } from "@/components/PageHero";
import { PracticeLoop } from "@/components/PracticeLoop";
import { ParaFigure } from "@/components/ParaFigure";
import { content, type Locale } from "@/lib/i18n";

export function HowItWorksPage({ locale }: { locale: Locale }) {
  const page = content[locale].howItWorks;
  return (
    <main id="main" className="page-enter">
      <PageHero eyebrow={page.eyebrow} title={page.title} intro={page.intro}>
        <ParaFigure asset="upload-transfer" locale={locale} eager />
      </PageHero>
      <PracticeLoop content={page} locale={locale} />
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
