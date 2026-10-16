import { PageCta } from "@/components/PageCta";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { ParaFigure } from "@/components/ParaFigure";
import { ParaIcon } from "@/components/ParaIcon";
import { content, type Locale } from "@/lib/i18n";

export function ProductPage({ locale }: { locale: Locale }) {
  const page = content[locale].product;
  return (
    <main id="main" className="page-enter">
      <PageHero eyebrow={page.eyebrow} title={page.title} intro={page.intro}>
        <div>
          <ParaFigure asset="rhythm-grid" locale={locale} eager />
          <p className="flow-summary">{page.visual}</p>
        </div>
      </PageHero>
      <section
        className="platform-reveal surface-noise"
        aria-labelledby="product-pillars"
      >
        <div className="wrap">
          <Reveal className="platform-intro">
            <p className="eyebrow">{page.eyebrow}</p>
            <h2 id="product-pillars">{page.pillars[2][1]}</h2>
          </Reveal>
          <ol className="platform-directions">
            {page.pillars.map(([number, title, copy], index) => (
              <li key={title}>
                <span>{number}</span>
                <ParaIcon
                  name={
                    [
                      "audio-recording",
                      "teacher-feedback",
                      "progress-over-time",
                    ][index]
                  }
                  music
                />
                <h3>{title}</h3>
                <p>{copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="teacher-principle surface-noise">
        <div className="wrap principle-grid">
          <h2>{page.principle}</h2>
          <p>{page.principleCopy}</p>
        </div>
      </section>
      <PageCta locale={locale} title={page.ctaTitle} />
    </main>
  );
}
