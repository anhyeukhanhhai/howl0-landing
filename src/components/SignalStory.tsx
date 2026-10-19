import { content, type Locale } from "@/lib/i18n";
import { sceneCopy } from "@/lib/studio";
import { ParaIcon } from "@/components/ParaIcon";
import { GlassSurface } from "@/components/GlassSurface";

/** Approved listening artwork; surrounding paths are separate concept geometry.
 * Raster-grain artwork uses crop/position/crossfade, never a fake path morph. */
export function SignalStory({
  locale,
  stage,
}: {
  locale: Locale;
  stage: number;
}) {
  const copy = sceneCopy(locale);
  return (
    <figure
      className="signal-story sculpture-stage material-story"
      data-stage={stage}
    >
      <div
        className="signal-sculpture"
        role="img"
        aria-label={content[locale].home.hero.aria}
      >
        <div className="signal-material ambient" aria-hidden="true" />
        <svg
          className="hero-signal-path"
          viewBox="0 0 680 640"
          fill="none"
          aria-hidden="true"
        >
          <g className="sculpture-guides">
            <path d="M40 180H640M40 320H640M40 460H640" />
          </g>
          <path
            className="signal-quiet"
            pathLength="1"
            d="M30 370C130 370 135 100 340 100S610 190 610 340S565 590 420 590"
          />
          <path
            className="sculpture-unfold"
            d="M30 370C130 370 135 100 340 100S610 190 610 340S565 590 420 590"
          />
          <path
            className="sculpture-next"
            d="M420 590C555 590 555 505 625 505M609 490L628 505L612 521"
          />
          <circle className="signal-origin" cx="30" cy="370" r="6" />
        </svg>
        <picture className="approved-listening ambient">
          <source
            media="(min-width: 1200px)"
            srcSet={`/brand/para/resources/para-art-03-listen-${locale}-grain.svg`}
          />
          <img
            src="/brand/para/resources/para-expressive-listening-grain.svg"
            alt=""
            width={680}
            height={540}
            fetchPriority="high"
          />
        </picture>
        <div className="assignment-capsule ambient">
          <GlassSurface raised rising className="assignment-material">
            <ParaIcon name="assignment" />
            <span>{copy.assignment}</span>
            <span aria-hidden="true">↗</span>
          </GlassSurface>
        </div>
        <div className="recording-glass">
          <GlassSurface raised rising className="recording-material">
            <span className="recording-meta">
              <ParaIcon name="upload" />
              {copy.recording}
              <span aria-hidden="true">01</span>
            </span>
            <svg viewBox="0 0 440 100" fill="none" aria-hidden="true">
              <path
                className="sculpture-wave"
                d="M16 50H48L59 30L70 73L83 14L98 86L111 39L127 61L141 22L155 76L170 40L185 63L201 26L217 78L233 43L249 60L265 25L280 72L298 39L315 61L329 45H424"
              />
              <g className="sculpture-time">
                <path d="M83 5V95M201 5V95M329 5V95" />
              </g>
              <circle className="sculpture-pin pin-1" cx="83" cy="50" r="7" />
              <circle className="sculpture-pin pin-2" cx="201" cy="50" r="7" />
              <circle className="sculpture-pin pin-3" cx="329" cy="50" r="7" />
            </svg>
            <span className="recording-timestamps" aria-hidden="true">
              <span>0:12</span>
              <span>0:28</span>
              <span>0:41</span>
            </span>
          </GlassSurface>
        </div>
        <div className="sculpture-label feedback-label">
          <GlassSurface material="smoke" className="feedback-material">
            <ParaIcon name="comment" />
            {copy.feedback}
          </GlassSurface>
        </div>
        <span className="sculpture-label next-label">
          {copy.nextPractice}
          <span aria-hidden="true"> ↗</span>
        </span>
        <span className="sculpture-timing" aria-hidden="true">
          0{stage + 1} / 05
        </span>
      </div>
      <figcaption>{copy.concept}</figcaption>
    </figure>
  );
}
