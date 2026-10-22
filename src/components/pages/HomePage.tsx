import { HeroLoopJourney } from "@/components/HeroLoopJourney";
import { BeliefMoment } from "@/components/BeliefMoment";
import { PerspectiveSwitcher } from "@/components/PerspectiveSwitcher";
import { WaitlistSection } from "@/components/WaitlistSection";
import { content, type Locale } from "@/lib/i18n";
export function HomePage({ locale }: { locale: Locale }) {
  return (
    <main id="main" className="studio-home">
      <HeroLoopJourney locale={locale} />
      <PerspectiveSwitcher
        locale={locale}
        content={content[locale].home.perspectives}
      />
      <BeliefMoment
        content={content[locale].belief}
        locale={locale}
        immersive
      />
      <WaitlistSection locale={locale} />
    </main>
  );
}
