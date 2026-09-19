"use client";
import { useCallback, useEffect, useRef } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { practiceRoute, practiceSteps } from "@/lib/practiceLoop";

export function PracticeLoop({
  eyebrow = "THE PRACTICE LOOP",
}: {
  eyebrow?: string;
}) {
  const root = useRef<HTMLElement>(null);
  const path = useRef<SVGPathElement>(null);
  const traveller = useRef<SVGGElement>(null);
  const routeLength = useRef(0);
  const update = useCallback((progress: number) => {
    const node = path.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.current!.dataset.stage = "4";
    } else if (window.innerWidth > 760) {
      root.current!.dataset.stage = String(
        Math.min(4, Math.floor(progress * 5)),
      );
    }
    const length = routeLength.current || node.getTotalLength();
    routeLength.current = length;
    const routeProgress = Math.min(0.95, 0.06 + progress * 0.89);
    const point = node.getPointAtLength(length * routeProgress);
    node.style.strokeDasharray = `${length}`;
    node.style.strokeDashoffset = `${length * (1 - routeProgress)}`;
    if (traveller.current)
      traveller.current.setAttribute(
        "transform",
        `translate(${point.x.toFixed(1)} ${point.y.toFixed(1)})`,
      );
  }, []);
  useScrollProgress(root, { mode: "pin", onProgress: update });
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const mobile = window.matchMedia("(max-width: 760px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const items = Array.from(element.querySelectorAll(".practice-step"));
    let observer: IntersectionObserver | undefined;
    const setup = () => {
      observer?.disconnect();
      if (!mobile.matches || reduced.matches) return;
      observer = new IntersectionObserver(
        () => {
          const target = window.innerHeight * 0.55;
          const nearest = items
            .map((item, index) => ({
              index,
              rect: item.getBoundingClientRect(),
            }))
            .filter(
              ({ rect }) => rect.bottom > 70 && rect.top < window.innerHeight,
            )
            .sort(
              (a, b) =>
                Math.abs((a.rect.top + a.rect.bottom) / 2 - target) -
                Math.abs((b.rect.top + b.rect.bottom) / 2 - target),
            )[0];
          if (nearest) element.dataset.stage = String(nearest.index);
        },
        { threshold: [0, 0.5, 1] },
      );
      items.forEach((item) => observer?.observe(item));
    };
    mobile.addEventListener("change", setup);
    reduced.addEventListener("change", setup);
    setup();
    return () => {
      observer?.disconnect();
      mobile.removeEventListener("change", setup);
      reduced.removeEventListener("change", setup);
    };
  }, []);
  return (
    <section
      ref={root}
      id="practice-loop"
      className="practice-loop"
      aria-labelledby="practice-loop-heading"
      data-stage="0"
    >
      <div className="practice-sticky wrap">
        <div className="practice-intro">
          <p className="eyebrow light">{eyebrow}</p>
          <h2 id="practice-loop-heading">
            A task becomes
            <br />
            <em>the next attempt.</em>
          </h2>
          <p className="practice-summary">
            Share → Open → Submit → Respond → Continue
          </p>
          <ol className="practice-steps" aria-label="Practice loop stages">
            {practiceSteps.map((step, index) => (
              <li
                className={`practice-step practice-step-${index}`}
                key={step.word}
              >
                <span className="practice-step-number">0{index + 1}</span>
                <div>
                  <strong>{step.word}</strong>
                  <p>{step.phrase}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="practice-end">
            A clearer path between one attempt and the next.
          </p>
        </div>
        <div className="practice-art" aria-hidden="true">
          <div className="practice-art-field" />
          <svg
            className="practice-svg"
            viewBox="0 0 700 600"
            role="presentation"
          >
            <defs>
              <linearGradient id="practice-route-glow" x1="0" x2="1">
                <stop stopColor="#F0A06B" />
                <stop offset="1" stopColor="#F5CF59" />
              </linearGradient>
            </defs>
            <path className="practice-route-base" d={practiceRoute} />
            <path
              ref={path}
              className="practice-route-active"
              d={practiceRoute}
            />
            <path
              className="practice-return"
              d="M 455 515 C 276 568 100 455 99 295 C 99 216 122 164 157 126"
            />
            <g ref={traveller} className="practice-traveller">
              <rect x="-83" y="-18" width="166" height="36" rx="18" />
              <text x="0" y="5">
                howl0.link/practice
              </text>
            </g>
            <g className="practice-task" transform="translate(155 120)">
              <circle r="28" />
              <path d="M-9 0h18M0-9v18" />
              <text x="40" y="5">
                TEACHER TASK
              </text>
            </g>
            <g
              className="practice-file practice-file-audio"
              transform="translate(486 260)"
            >
              <rect x="-37" y="-21" width="74" height="42" rx="8" />
              <text x="0" y="5">
                AUDIO
              </text>
            </g>
            <g
              className="practice-file practice-file-video"
              transform="translate(570 326)"
            >
              <rect x="-37" y="-21" width="74" height="42" rx="8" />
              <text x="0" y="5">
                VIDEO
              </text>
            </g>
            <g className="practice-packet" transform="translate(555 373)">
              <rect x="-54" y="-24" width="108" height="48" rx="22" />
              <text x="0" y="5">
                SUBMITTED ✓
              </text>
            </g>
            <g className="practice-feedback" transform="translate(260 492)">
              <rect x="-55" y="-22" width="110" height="44" rx="22" />
              <text x="0" y="5">
                FEEDBACK ↗
              </text>
            </g>
            <path
              className="practice-wave wave-unsettled"
              d="M 233 318 C 254 277 272 355 292 309 S 324 353 345 312 S 375 357 397 308 S 430 349 452 315"
            />
            <path
              className="practice-wave wave-clear"
              d="M 222 318 C 250 290 270 345 298 318 S 345 292 370 318 S 420 346 450 318"
            />
            <line
              className="practice-threshold"
              x1="571"
              x2="626"
              y1="354"
              y2="399"
            />
          </svg>
          <span className="practice-edge-label practice-edge-teacher">
            TEACHER / SHARE
          </span>
          <span className="practice-edge-label practice-edge-student">
            STUDENT / PRACTISE
          </span>
          <div className="practice-link">
            howl0.link/practice <span>↗</span>
          </div>
          <div className="practice-progress">
            <span />
          </div>
        </div>
      </div>
    </section>
  );
}
