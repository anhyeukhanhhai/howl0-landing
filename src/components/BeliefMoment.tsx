import { ParaFigure } from "@/components/ParaFigure";
import { paraContent } from "@/lib/para";
import type { Locale } from "@/lib/i18n";
export function BeliefMoment({
  content,
  locale,
}: {
  content: {
    eyebrow: string;
    title: string;
    copy: string;
    labels: readonly string[];
  };
  locale: Locale;
}) {
  return (
    <section id="belief" className="belief section-pad">
      <div className="wrap belief-grid">
        <div>
          <p className="eyebrow">{content.eyebrow}</p>
          <h2>{content.title}</h2>
          <p>{content.copy}</p>
          <ol className="feedback-markers">
            {content.labels.map((label, index) => (
              <li key={label}>
                <span>0{index + 1}</span>
                {label}
              </li>
            ))}
          </ol>
        </div>
        <ParaFigure
          asset="graphics/para-progress-between-attempts.svg"
          locale={locale}
          caption={paraContent[locale].comparison}
        />
      </div>
    </section>
  );
}
