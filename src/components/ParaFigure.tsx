import { conceptCaption } from "@/lib/para";
import type { Locale } from "@/lib/i18n";

export function ParaFigure({
  asset,
  locale,
  caption,
  eager = false,
  className = "",
}: {
  asset: string;
  locale: Locale;
  caption?: string;
  eager?: boolean;
  className?: string;
}) {
  const [width, height] = asset.includes("hero")
    ? [740, 530]
    : asset.includes("learning-loop")
      ? [760, 276]
      : asset.includes("between-attempts")
        ? [605, 260]
        : [600, 420];
  return (
    <figure className={`para-figure ${className}`}>
      <div className="illustration-ground">
        <img
          src={`/brand/para/${asset}`}
          alt=""
          width={width}
          height={height}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
        />
      </div>
      <figcaption>{caption || conceptCaption(locale)}</figcaption>
    </figure>
  );
}
