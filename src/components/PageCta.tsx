import Link from "next/link";
import { content, localePath, type Locale } from "@/lib/i18n";

export function PageCta({ locale, title }: { locale: Locale; title: string }) {
  const dictionary = content[locale].navigation;
  return (
    <section className="page-cta">
      <div className="wrap page-cta-inner">
        <div>
          <p className="eyebrow light">{dictionary.waitlist}</p>
          <h2>{title}</h2>
        </div>
        <Link
          className="button button-light"
          href={`${localePath(locale, "/")}#waitlist`}
        >
          {dictionary.waitlist} <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </section>
  );
}
