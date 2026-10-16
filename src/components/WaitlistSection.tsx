import { WaitlistForm } from "@/components/WaitlistForm";
import { content, type Locale } from "@/lib/i18n";
import Link from "next/link";
import { localePath } from "@/lib/i18n";
import { sceneCopy } from "@/lib/studio";
import { BrandLogo } from "@/components/BrandLogo";
import { ScrollScene } from "@/components/ScrollScene";
import { SceneHeading } from "@/components/SceneHeading";
import { ParaIcon } from "@/components/ParaIcon";
export function WaitlistSection({ locale }: { locale: Locale }) {
  const page = content[locale].waitlist;
  const copy = sceneCopy(locale);
  return (
    <ScrollScene id="waitlist" className="waitlist scene-closing">
      <div className="wrap waitlist-grid">
        <div>
          <figure className="closing-mark" aria-label={copy.openLoop}>
            <svg viewBox="0 0 440 220" fill="none" aria-hidden="true">
              <path
                pathLength="1"
                d="M395 165C350 220 95 230 45 135C-5 40 135-15 255 35C335 68 300 130 365 135"
              />
              <circle cx="395" cy="165" r="5" />
            </svg>
            <BrandLogo width={168} height={72} />
          </figure>
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
