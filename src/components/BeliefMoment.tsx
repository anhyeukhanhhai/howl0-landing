import { ParaFigure } from "@/components/ParaFigure";
import { paraContent } from "@/lib/para";
import type { Locale } from "@/lib/i18n";
import { SceneHeading } from "@/components/SceneHeading";
import { ScrollScene } from "@/components/ScrollScene";
import { sceneCopy } from "@/lib/studio";
export function BeliefMoment({
  content,
  locale,
  immersive = false,
}: {
  content: {
    eyebrow: string;
    title: string;
    copy: string;
    labels: readonly string[];
  };
  locale: Locale;
  immersive?: boolean;
}) {
  if (immersive) {
    const copy = sceneCopy(locale);
    return (
      <ScrollScene id="belief" className="scene-belief">
        <div className="belief-aperture" aria-hidden="true" />
        <div className="wrap belief-statement">
          <p className="eyebrow">{content.eyebrow}</p>
          <SceneHeading lines={copy.beliefLines} />
          <p className="belief-support">{copy.beliefCopy}</p>
          <div className="belief-signal" aria-hidden="true">
            <svg viewBox="0 0 1240 170" preserveAspectRatio="none">
              <path
                className="belief-wave-echo"
                d="M0 90C100 20 170 160 280 90S450 20 560 90S730 160 840 90S1010 20 1240 90"
              />
              <path
                className="belief-wave-main"
                pathLength="1"
                d="M0 90C100 20 170 160 280 90S450 20 560 90S730 160 840 90S1010 20 1240 90"
              />
              <circle cx="560" cy="90" r="7" />
            </svg>
          </div>
          <ul className="belief-cues">
            {content.labels.map((label, index) => (
              <li key={label}>
                <span>0{index + 1}</span>
                {label}
              </li>
            ))}
          </ul>
        </div>
      </ScrollScene>
    );
  }
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
          asset="feedback-wave"
          locale={locale}
          caption={paraContent[locale].concept}
        />
      </div>
    </section>
  );
}
