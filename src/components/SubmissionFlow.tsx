"use client";

import { useCallback, useRef } from "react";
import { content, type Locale } from "@/lib/i18n";
import { sceneCopy } from "@/lib/studio";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { SceneHeading } from "@/components/SceneHeading";
import { ParaIcon } from "@/components/ParaIcon";
import { ExpressiveIcon } from "@/components/ExpressiveIcon";
import { GlassSurface } from "@/components/GlassSurface";

const route =
  "M126 114C220 20 362 18 444 110S615 243 540 332S398 498 260 438S60 305 126 114";

/** Adapted from Howl0's original SVG traveller. Native scroll draws a single
 * path; the five stages remain readable, even without JavaScript or motion. */
export function SubmissionFlow({ locale }: { locale: Locale }) {
  const page = content[locale].home;
  const copy = sceneCopy(locale);
  const root = useRef<HTMLElement>(null);
  const path = useRef<SVGPathElement>(null);
  const traveller = useRef<SVGGElement>(null);
  const length = useRef(0);
  const update = useCallback((value: number) => {
    const element = root.current;
    const curve = path.current;
    if (!element || !curve) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const progress = reduced
      ? 1
      : innerWidth > 900 && innerHeight > 740
        ? value
        : Math.min(
            1,
            Math.max(
              0,
              (innerHeight * 0.72 - element.getBoundingClientRect().top) /
                (element.clientHeight * 0.85),
            ),
          );
    element.dataset.stage = String(Math.min(4, Math.floor(progress * 5)));
    element.style.setProperty("--loop-progress", String(progress));
    length.current ||= curve.getTotalLength();
    const point = curve.getPointAtLength(
      length.current * (0.04 + progress * 0.92),
    );
    traveller.current?.setAttribute(
      "transform",
      `translate(${point.x.toFixed(2)} ${point.y.toFixed(2)})`,
    );
  }, []);
  useScrollProgress(root, { mode: "pin", onProgress: update });
  return (
    <section
      ref={root}
      id="submission-flow"
      className="scene-loop"
      data-stage="0"
      aria-labelledby="submission-flow-heading"
    >
      <div className="loop-sticky wrap">
        <div className="loop-copy">
          <p className="eyebrow">{page.loop.eyebrow}</p>
          <SceneHeading id="submission-flow-heading" lines={copy.loopLines} />
          <p className="loop-intro">{copy.loopIntro}</p>
          <ol className="submission-sequence" aria-label={page.loop.eyebrow}>
            {page.hero.stages.map((label, index) => (
              <li className={`loop-step step-${index}`} key={label}>
                <span className="loop-step-index">0{index + 1}</span>
                <div>
                  <h3>{label}</h3>
                  <p>{copy.steps[index]}</p>
                </div>
                <span className="loop-step-signal" aria-hidden="true" />
              </li>
            ))}
          </ol>
        </div>
        <figure className="loop-composition">
          <div className="loop-diagram" role="img" aria-label={page.hero.aria}>
            <div className="loop-material" aria-hidden="true" />
            <div className="loop-symbols" aria-hidden="true">
              {[
                "assignment",
                "rhythm",
                "recording",
                "feedback",
                "next-step",
              ].map((name, index) => (
                <ExpressiveIcon
                  key={name}
                  name={name}
                  className={`loop-symbol symbol-${index}`}
                />
              ))}
            </div>
            <div className="loop-recording-ground" aria-hidden="true">
              <GlassSurface rising />
            </div>
            <svg viewBox="0 0 680 540" fill="none" aria-hidden="true">
              <path className="loop-route-base" d={route} />
              <path
                ref={path}
                className="loop-route-active"
                pathLength="1"
                d={route}
              />
              <path
                className="loop-interval"
                d="M160 242H530M160 270H530M160 298H530"
              />
              <path
                className="loop-wave"
                pathLength="1"
                d="M190 270H213L226 235L239 312L254 216L269 320L284 253L299 286L314 230L330 312L345 255L360 282L376 237L391 300L407 267H482"
              />
              <g className="loop-feedback-pins">
                <path d="M254 192V334M345 192V334M436 192V334" />
                <circle cx="254" cy="270" r="9" />
                <circle cx="345" cy="270" r="9" />
                <circle cx="436" cy="270" r="9" />
              </g>
              <path
                className="loop-next-path"
                d="M482 270C535 270 558 371 465 408M470 392L461 411L483 413"
              />
              <g
                ref={traveller}
                className="loop-traveller"
                transform="translate(126 114)"
              >
                <circle r="14" />
                <circle r="5" />
              </g>
              <circle className="loop-start" cx="126" cy="114" r="6" />
            </svg>
            <div className="loop-task-capsule">
              <GlassSurface material="quiet" className="assignment-material">
                <ParaIcon name="assignment" music />
                {copy.assignment}
                <span aria-hidden="true">↗</span>
              </GlassSurface>
            </div>
            <span className="loop-record-label">{copy.recording}</span>
            <span className="loop-response-label">{copy.feedback}</span>
            <div className="loop-timestamp">
              <GlassSurface material="smoke" className="feedback-material">
                <ParaIcon name="comment" />
                <span aria-hidden="true">0:28</span>
                <span className="sr-only">{copy.feedback}</span>
              </GlassSurface>
            </div>
            <span className="loop-next-instruction">
              {copy.instruction}
              <span aria-hidden="true">↗</span>
            </span>
            <span className="loop-return-label">{copy.continue}</span>
          </div>
          <figcaption>
            {copy.concept}
            <br />
            {copy.loopNote}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
