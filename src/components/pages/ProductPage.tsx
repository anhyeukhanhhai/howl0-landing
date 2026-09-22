import { PageCta } from "@/components/PageCta";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { content, type Locale } from "@/lib/i18n";

export function ProductPage({ locale }: { locale: Locale }) {
  const page = content[locale].product;
  return (
    <main id="main" className="page-enter">
      <PageHero eyebrow={page.eyebrow} title={page.title} intro={page.intro}>
        <div className="page-signal-mark product-hero-art" aria-hidden="true">
          <img
            src="/brand/howl0/02-symbols/howl0-return-loop-master.svg"
            alt=""
          />
          <span>{page.visual}</span>
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
            {page.pillars.map(([number, title, copy]) => (
              <li key={title}>
                <span>{number}</span>
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
