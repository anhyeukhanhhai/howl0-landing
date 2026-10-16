"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { content, localePath, type Locale } from "@/lib/i18n";
import { paraContent } from "@/lib/para";
import { SignalStory } from "@/components/SignalStory";
import { ParaIcon } from "@/components/ParaIcon";
import { SubmissionFlow } from "@/components/SubmissionFlow";

/** One finite, user-started story. Essential stages remain visible at all times. */
export function HomeIntro({ locale }: { locale: Locale }) {
  const hero = content[locale].home.hero;
  const copy = paraContent[locale];
  const [stage, setStage] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [visible, setVisible] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const surface = useRef<HTMLDivElement>(null);
  const remaining = useRef(4);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => {
      setReduced(media.matches);
      setPlaying(false);
    };
    const visibility = () => {
      if (document.hidden) setPlaying(false);
    };
    change();
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.25 },
    );
    if (surface.current) observer.observe(surface.current);
    media.addEventListener("change", change);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", change);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  useEffect(() => {
    if (!playing || reduced || !visible || hovered || focused) return;
    const timer = setTimeout(() => {
      setStage((stage + 1) % 4);
      remaining.current -= 1;
      if (!remaining.current) setPlaying(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, [playing, reduced, stage, visible, hovered, focused]);
  function select(next: number) {
    setPlaying(false);
    setStage(next);
  }
  function toggle() {
    if (reduced) {
      select((stage + 1) % 4);
      return;
    }
    remaining.current = 4;
    setPlaying((value) => !value);
  }
  return (
    <>
      <section id="top" className="hero home-hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">{hero.eyebrow}</p>
            <h1>{hero.title}</h1>
            <p className="hero-lead">{hero.intro}</p>
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
                {hero.secondary}
                <ParaIcon name="arrow-right" />
              </Link>
            </div>
            <p className="development-label">{hero.status}</p>
          </div>
          <div
            className="hero-visual"
            data-stage={stage}
            data-playing={playing}
          >
            <div
              ref={surface}
              className="story-surface"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              onFocusCapture={() => setFocused(true)}
              onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget))
                  setFocused(false);
              }}
            >
              <p className="story-eyebrow">{copy.storyLabel}</p>
              <SignalStory locale={locale} stage={stage} />
              <ol className="story-stages" aria-label={copy.storyLabel}>
                {copy.storyStages.map((label, index) => (
                  <li key={label}>
                    <button
                      onClick={() => select(index)}
                      aria-current={index === stage ? "step" : undefined}
                    >
                      <span>0{index + 1}</span>
                      {label}
                    </button>
                  </li>
                ))}
              </ol>
            </div>
            <div className="hero-controls">
              <span className="flow-label" aria-live="polite">
                {copy.storyStages[stage]}
              </span>
              <div>
                <button
                  className="story-control"
                  aria-pressed={playing}
                  onClick={toggle}
                >
                  {playing ? copy.pause : copy.play}
                  <ParaIcon name={playing ? "pause" : "play"} />
                </button>
                <button
                  className="story-control story-next"
                  aria-label={copy.next}
                  onClick={() => select((stage + 1) % 4)}
                >
                  <ParaIcon name="arrow-right" />
                </button>
              </div>
            </div>
            <p className="story-detail" key={stage}>
              {copy.storyDetails[stage]}
            </p>
            <p className="submission-entry">
              {content[locale].howItWorks.simpleFlow}
            </p>
          </div>
        </div>
      </section>
      <SubmissionFlow locale={locale} active={[0, 2, 3, 4][stage]} />
    </>
  );
}
