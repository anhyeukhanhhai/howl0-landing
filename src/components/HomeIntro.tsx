"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { content, localePath, type Locale } from "@/lib/i18n";
import { paraContent } from "@/lib/para";
import { ParaFigure } from "@/components/ParaFigure";
import { ParaIcon } from "@/components/ParaIcon";
import { SubmissionFlow } from "@/components/SubmissionFlow";

/** One user-started controller, shared by the hero and five-step workflow. */
export function HomeIntro({ locale }: { locale: Locale }) {
  const hero = content[locale].home.hero;
  const copy = paraContent[locale];
  const [stage, setStage] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(true);
  const remaining = useRef(5);
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
    media.addEventListener("change", change);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      media.removeEventListener("change", change);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  useEffect(() => {
    if (!playing || reduced) return;
    const timer = setTimeout(() => {
      setStage((stage + 1) % 5);
      remaining.current -= 1;
      if (!remaining.current) setPlaying(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, [playing, reduced, stage]);
  function next() {
    setPlaying(false);
    setStage((value) => (value + 1) % 5);
  }
  function toggle() {
    if (reduced) {
      next();
      return;
    }
    remaining.current = 5;
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
              <a
                className="button button-primary"
                href={`${localePath(locale, "/")}#waitlist`}
              >
                {hero.primary}
              </a>
              <Link
                className="text-link"
                href={localePath(locale, "/how-it-works")}
                prefetch={false}
              >
                {hero.secondary}
                <ParaIcon name="arrow-right" />
              </Link>
            </div>
            <p className="development-label">{hero.status}</p>
          </div>
          <div className="hero-visual" data-stage={stage}>
            <ParaFigure
              asset="illustrations/para-hero-submission-feedback.svg"
              locale={locale}
              eager
            />
            <p className="submission-entry">
              {content[locale].howItWorks.simpleFlow}
            </p>
            <div className="hero-controls">
              <span className="flow-label" aria-live="polite">
                {content[locale].home.loop.steps[stage][1]}
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
                  onClick={next}
                >
                  <ParaIcon name="arrow-right" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <SubmissionFlow locale={locale} active={stage} />
    </>
  );
}
