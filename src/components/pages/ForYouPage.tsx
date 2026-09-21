import { AudienceTabs } from "@/components/AudienceTabs";
import { PageCta } from "@/components/PageCta";
import { PageHero } from "@/components/PageHero";
import { content, type Locale } from "@/lib/i18n";

export function ForYouPage({ locale }: { locale: Locale }) {
  const page = content[locale].forYou;
  return (
    <main id="main" className="page-enter">
      <PageHero eyebrow={page.eyebrow} title={page.title} intro={page.intro} />
      <section className="audiences audience-page section-pad">
        <div className="wrap">
          <AudienceTabs audience={page.views} label={page.tabsLabel} />
        </div>
      </section>
      <PageCta locale={locale} title={page.ctaTitle} />
    </main>
  );
}
