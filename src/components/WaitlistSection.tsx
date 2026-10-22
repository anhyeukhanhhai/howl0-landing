import { WaitlistForm } from "@/components/WaitlistForm";
import { content, type Locale } from "@/lib/i18n";
import Link from "next/link";
import { localePath } from "@/lib/i18n";
import { sceneCopy } from "@/lib/studio";
import { BrandLogo } from "@/components/BrandLogo";
import { ScrollScene } from "@/components/ScrollScene";
import { SceneHeading } from "@/components/SceneHeading";
import { ParaIcon } from "@/components/ParaIcon";
import { PerformancePortraits } from "@/components/PerformancePortraits";
export function WaitlistSection({ locale }: { locale: Locale }) {
  const page = content[locale].waitlist;
  const copy = sceneCopy(locale);
  return (
    <ScrollScene id="waitlist" className="waitlist scene-closing">
      <div className="wrap closing-editorial">
        <PerformancePortraits locale={locale} />
        <div className="closing-mark">
          <BrandLogo width={280} height={76} footer />
        </div>
      </div>
      <div className="wrap waitlist-grid">
        <div>
          <p className="eyebrow">{page.eyebrow}</p>
          <SceneHeading lines={copy.closeLines} />
          <p>{copy.closeCopy}</p>
          <Link
            className="text-link"
            href={localePath(locale, "/product")}
            prefetch={false}
          >
            {copy.closeAction}
            <ParaIcon name="arrow-right" />
          </Link>
        </div>
        <WaitlistForm locale={locale} />
      </div>
    </ScrollScene>
  );
}
