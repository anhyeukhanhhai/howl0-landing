"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { content, localePath, type Locale } from "@/lib/i18n";
import { sceneCopy } from "@/lib/studio";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useVisibleAnimation } from "@/hooks/useVisibleAnimation";
import { SignalStory } from "@/components/SignalStory";
import { SceneHeading } from "@/components/SceneHeading";
import { ParaIcon } from "@/components/ParaIcon";

export function HomeIntro({ locale }: { locale: Locale }) {
  const hero = content[locale].home.hero;
  const copy = sceneCopy(locale);
  const root = useRef<HTMLElement>(null);
  const [stage, setStage] = useState(0);
  const [paused, setPaused] = useState(false);
  useScrollProgress(root);
  useVisibleAnimation(root, paused);
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      const node = root.current;
      if (
        node?.dataset.playing !== "true" ||
        node.querySelector(".sculpture-stage")?.matches(":hover")
      )
        return;
      setStage((value) => (value + 1) % 5);
    }, 2200);
    return () => clearInterval(timer);
  }, [paused]);
  function select(value: number) {
    setPaused(true);
    setStage(value);
  }
  return (
    <section
      id="top"
      ref={root}
      className="home-hero scene-hero"
      data-stage={stage}
      data-playing="false"
    >
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">{hero.eyebrow}</p>
          <SceneHeading level={1} lines={copy.heroLines} />
          <p className="hero-lead">{copy.platform}</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#submission-flow">
              {hero.primary}
              <ParaIcon name="arrow-right" />
            </a>
            <Link
              className="text-link"
              href={localePath(locale, "/product")}
              prefetch={false}
            >
              {copy.discover}
              <ParaIcon name="arrow-right" />
            </Link>
          </div>
          <p className="development-label">{hero.status}</p>
        </div>
        <div className="hero-visual" data-stage={stage}>
          <SignalStory locale={locale} stage={stage} />
          <ol
            className="hero-stage-keys"
            aria-label={content[locale].home.loop.eyebrow}
          >
            {hero.stages.map((label, index) => (
              <li
                key={label}
                style={{ "--stage-index": index } as CSSProperties}
              >
                <button
                  onClick={() => select(index)}
                  aria-current={stage === index ? "step" : undefined}
                >
                  <span>0{index + 1}</span>
                  {label}
                </button>
              </li>
            ))}
          </ol>
          <div className="hero-story-controls">
            <span>{hero.visualMessage}</span>
            <button
              className="story-control ambient-toggle"
              aria-pressed={paused}
              onClick={() => setPaused((value) => !value)}
            >
              {paused ? copy.resume : copy.pause}
              <ParaIcon name={paused ? "play" : "pause"} />
            </button>
            <button
              className="story-control story-next"
              aria-label={copy.next}
              onClick={() => select((stage + 1) % 5)}
            >
              <ParaIcon name="arrow-right" />
            </button>
          </div>
        </div>
      </div>
      <div className="hero-handoff" aria-hidden="true">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M930 0C930 55 700 55 700 120" />
        </svg>
      </div>
      <div className="hero-baseline wrap" aria-hidden="true">
        <span>{hero.stages[0]}</span>
        <span />
        <span>{hero.stages[4]}</span>
      </div>
    </section>
  );
}
