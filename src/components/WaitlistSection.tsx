import { WaitlistForm } from "@/components/WaitlistForm";
import { content, type Locale } from "@/lib/i18n";
export function WaitlistSection({ locale }: { locale: Locale }) {
  const page = content[locale].waitlist;
  return (
    <section id="waitlist" className="waitlist section-pad">
      <div className="wrap waitlist-grid">
        <div>
          <p className="eyebrow">{page.eyebrow}</p>
          <h2>{page.title}</h2>
          <p>{page.copy}</p>
        </div>
        <WaitlistForm locale={locale} />
      </div>
    </section>
  );
}
