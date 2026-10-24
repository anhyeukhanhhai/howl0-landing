import { type Locale } from "@/lib/i18n";
import { ProductCta } from "@/components/ProductCta";

export function PageCta({ locale, title }: { locale: Locale; title: string }) {
  return (
    <section className="page-cta">
      <div className="wrap page-cta-inner">
        <div>
          <h2>{title}</h2>
        </div>
        <ProductCta locale={locale} />
      </div>
    </section>
  );
}
