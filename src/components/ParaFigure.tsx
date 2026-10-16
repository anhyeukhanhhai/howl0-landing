import { conceptCaption } from "@/lib/para";
import type { Locale } from "@/lib/i18n";

export type SignalAsset =
  | "hero-signal"
  | "practice-loop"
  | "feedback-wave"
  | "rhythm-grid"
  | "progress-arc"
  | "upload-transfer"
  | "timestamp-markers";

export function ParaFigure({
  asset,
  locale,
  caption,
  eager = false,
  className = "",
}: {
  asset: SignalAsset;
  locale: Locale;
  caption?: string;
  eager?: boolean;
  className?: string;
}) {
  return (
    <figure className={`para-figure ${className}`}>
      <div className="illustration-ground">
        <img
          src={`/brand/para/abstract/${asset}.svg`}
          alt=""
          width={640}
          height={360}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
        />
      </div>
      <figcaption>{caption || conceptCaption(locale)}</figcaption>
    </figure>
  );
}
