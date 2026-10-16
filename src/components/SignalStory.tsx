import { useId } from "react";
import { content, type Locale } from "@/lib/i18n";
import { sceneCopy } from "@/lib/studio";
import { ParaIcon } from "@/components/ParaIcon";

/** Separate abstract artwork, never logo geometry. Shared-position handoffs,
 * not interpolation between incompatible SVG paths or a functioning interface. */
export function SignalStory({
  locale,
  stage,
}: {
  locale: Locale;
  stage: number;
}) {
  const copy = sceneCopy(locale);
  const id = useId();
  return (
    <figure className="signal-story sculpture-stage" data-stage={stage}>
      <div
        className="signal-sculpture"
        role="img"
        aria-label={content[locale].home.hero.aria}
      >
        <svg viewBox="0 0 680 640" fill="none" aria-hidden="true">
          <defs>
            <linearGradient
              id={id}
              x1="140"
              y1="60"
              x2="570"
              y2="580"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#A92E5D" />
              <stop offset=".57" stopColor="#8F234D" />
              <stop offset="1" stopColor="#F0A06B" />
            </linearGradient>
          </defs>
          <g className="sculpture-guides">
            <path d="M55 170H625M55 270H625M55 370H625M55 470H625" />
            <path d="M180 60V590M340 60V590M500 60V590" />
          </g>
          <g className="sculpture-ribbon ambient">
            <path
              className="ribbon-shadow"
              d="M110 465C170 550 290 538 330 421C370 304 175 250 220 143C265 36 455 60 497 183C539 306 420 375 450 469C470 531 533 541 590 510"
            />
            <path
              className="ribbon-body"
              stroke={`url(#${id})`}
              d="M110 465C170 550 290 538 330 421C370 304 175 250 220 143C265 36 455 60 497 183C539 306 420 375 450 469C470 531 533 541 590 510"
            />
            <path
              className="ribbon-thread"
              d="M110 465C170 550 290 538 330 421C370 304 175 250 220 143C265 36 455 60 497 183C539 306 420 375 450 469C470 531 533 541 590 510"
            />
          </g>
          <path
            className="sculpture-unfold"
            d="M110 465C170 550 290 538 330 421C370 304 175 250 220 143C265 36 455 60 497 183C539 306 420 375 450 469C470 531 533 541 590 510"
          />
          <g className="sculpture-recording">
            <path
              className="sculpture-wave"
              d="M345 355H370L382 325L395 388L410 296L427 410L442 335L455 373L470 320L484 382L499 347H585"
            />
            <path
              className="sculpture-time"
              d="M395 290V416M470 290V416M552 290V416"
            />
            <circle className="sculpture-pin pin-1" cx="395" cy="355" r="8" />
            <circle className="sculpture-pin pin-2" cx="470" cy="355" r="8" />
            <circle className="sculpture-pin pin-3" cx="552" cy="355" r="8" />
          </g>
          <path
            className="sculpture-next"
            d="M345 355C440 355 450 505 568 485L590 476M578 462L596 475L582 491"
          />
        </svg>
        <span className="assignment-capsule ambient">
          <ParaIcon name="assignment" music />
          <span>{copy.assignment}</span>
          <span aria-hidden="true">↗</span>
        </span>
        <span className="sculpture-label recording-label">
          {copy.recording}
        </span>
        <span className="sculpture-label feedback-label">{copy.feedback}</span>
        <span className="sculpture-label next-label">{copy.nextPractice}</span>
        <span className="sculpture-timing" aria-hidden="true">
          01 — 05
        </span>
      </div>
      <figcaption>{copy.concept}</figcaption>
    </figure>
  );
}
