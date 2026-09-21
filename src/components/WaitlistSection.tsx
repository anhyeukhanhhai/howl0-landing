import { WaitlistForm } from "@/components/WaitlistForm";
import { ScrollScene } from "@/components/ScrollScene";
import { content, type Locale } from "@/lib/i18n";

export function WaitlistSection({ locale }: { locale: Locale }) {
  const dictionary = content[locale].waitlist;
  return (
    <ScrollScene
      id="waitlist"
      className="waitlist waitlist-scroll dark-section surface-noise"
    >
      <div className="wrap waitlist-grid">
        <div>
          <p className="eyebrow light">{dictionary.eyebrow}</p>
          <h2>{dictionary.title}</h2>
          <p>{dictionary.copy}</p>
          <div className="waitlist-line" aria-hidden="true" />
        </div>
        <WaitlistForm locale={locale} />
      </div>
    </ScrollScene>
  );
}
