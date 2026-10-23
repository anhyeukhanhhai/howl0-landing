import { HeroLoopJourney } from "@/components/HeroLoopJourney";
import { BeliefMoment } from "@/components/BeliefMoment";
import { PerspectiveSwitcher } from "@/components/PerspectiveSwitcher";
import { ProductInvitation } from "@/components/ProductInvitation";
import { content, type Locale } from "@/lib/i18n";
import { SharedWaveEnvironment } from "@/components/SharedWaveEnvironment";
export function HomePage({ locale }: { locale: Locale }) {
  return (
    <SharedWaveEnvironment>
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
      <ProductInvitation locale={locale} />
    </SharedWaveEnvironment>
  );
}
