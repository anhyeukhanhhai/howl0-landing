"use client";

import { content, type Locale } from "@/lib/i18n";
import { paraContent } from "@/lib/para";

/** Geometry adapted from v2 signal, feedback and loop assets. Not a live UI. */
export function SignalStory({
  locale,
  stage,
}: {
  locale: Locale;
  stage: number;
}) {
  const copy = paraContent[locale];
  return (
    <figure className="signal-story" data-stage={stage}>
      <div
        className="signal-canvas"
        role="img"
        aria-label={content[locale].home.hero.aria}
      >
        <svg viewBox="0 0 640 400" fill="none" aria-hidden="true">
          <g className="signal-staff">
            {[120, 160, 200, 240, 280].map((y) => (
              <path key={y} d={`M24 ${y}H616`} />
            ))}
            {[104, 248, 392, 536].map((x) => (
              <path key={x} d={`M${x} 80V320`} />
            ))}
          </g>
          <circle className="signal-orbit" cx="320" cy="200" r="156" />
          <g className="signal-phase signal-assignment">
            <path
              className="signal-echo"
              d="M35 200C135 80 170 320 270 200S405 80 605 200"
            />
            <path
              className="signal-wave"
              d="M24 200h72c12 0 14-65 28-65s18 132 32 132 18-111 32-111 16 76 31 76 19-38 32-38h54C380 194 407 140 450 164S530 220 616 200"
            />
            <circle className="signal-pin" cx="305" cy="194" r="10" />
          </g>
          <g className="signal-phase signal-transfer">
            <path
              className="signal-wave"
              d="M24 200h72c12 0 14-65 28-65s18 132 32 132 18-111 32-111 16 76 31 76 19-38 32-38h100"
            />
            <rect
              className="signal-file"
              x="370"
              y="108"
              width="222"
              height="184"
              rx="18"
            />
            <path
              className="signal-wave"
              d="M402 196h24l9-30 13 64 14-80 15 94 12-49 13 23 9-37 15 28h31"
            />
            <path className="signal-file-line" d="M403 260h112" />
            <circle className="signal-pin" cx="352" cy="194" r="8" />
          </g>
          <g className="signal-phase signal-response">
            <path
              className="signal-wave"
              d="M40 200h46l12-45 17 94 19-141 19 182 18-101 14 28 18-53 20 77 20-113 17 146 20-62 20-40 19 54 20-28h210"
            />
            <path
              className="signal-marker"
              d="M110 76V310M277 76V310M490 76V310"
            />
            <circle className="signal-pin" cx="110" cy="200" r="10" />
            <circle
              className="signal-pin signal-pin-apricot"
              cx="277"
              cy="200"
              r="10"
            />
            <circle className="signal-pin" cx="490" cy="200" r="10" />
          </g>
          <g className="signal-phase signal-repeat">
            <path
              className="signal-loop-berry"
              d="M320 81a119 119 0 0 1 114 85m0 0-23-7m23 7-11-24"
            />
            <path
              className="signal-loop-apricot"
              d="M439 200a119 119 0 0 1-113 119m0 0 17-19m-17 19 30 0"
            />
            <path
              className="signal-loop-ink"
              d="M320 319a119 119 0 0 1-114-85m0 0 23 7m-23-7 11 24"
            />
            <path
              className="signal-loop-butter"
              d="M201 200A119 119 0 0 1 314 81"
            />
            <path
              className="signal-wave"
              d="M252 200h25l10-28 13 60 15-78 15 86 15-40h45"
            />
          </g>
        </svg>
        <span className="signal-stage-index" aria-hidden="true">
          0{stage + 1}
        </span>
      </div>
      <figcaption>{copy.concept}</figcaption>
    </figure>
  );
}
