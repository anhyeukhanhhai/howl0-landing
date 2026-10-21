"use client";

import { useRef, useState } from "react";
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
  const [paused, setPaused] = useState(false);
  useScrollProgress(root);
  useVisibleAnimation(root, paused);
  return (
    <section
      id="top"
      ref={root}
      className="home-hero scene-hero"
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
        </div>
        <div className="hero-visual">
          <SignalStory locale={locale} />
          <div className="hero-story-controls">
            <button
              className="story-control ambient-toggle"
              aria-pressed={paused}
              onClick={() => setPaused((value) => !value)}
            >
              {paused ? copy.resume : copy.pause}
              <ParaIcon name={paused ? "play" : "pause"} />
            </button>
          </div>
        </div>
      </div>
      <div className="hero-handoff" aria-hidden="true">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M930 0C930 55 700 55 700 120" />
        </svg>
      </div>
    </section>
  );
}
