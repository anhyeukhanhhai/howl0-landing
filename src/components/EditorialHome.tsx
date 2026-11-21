import Link from "next/link";
import { EditorialMotionText } from "@/components/EditorialMotionText";
import { FeatureShowcase } from "@/components/FeatureShowcase";
import { EditorialEffects } from "@/components/EditorialGsapEffects";
import { EditorialCta } from "@/components/EditorialHeader";
import "@/app/editorial-home.css";
import "@/app/reference-home.css";

const assets = "/brand/para/homepage/";

export function EditorialHome() {
  return (
    <main id="main" className="para-editorial">
      <EditorialEffects />
      <section className="ed-hero-stage" aria-labelledby="ed-title">
        <div className="ed-hero">
          <div className="ed-hero-copy">
            <h1 id="ed-title">
              <span>
                See the <em className="ed-focus-word">progress</em>
              </span>{" "}
              <span>between lessons.</span>
            </h1>
            <p>
              Share a practice take, hear from your teacher, and know what to
              try next.
            </p>
            <div className="ed-hero-actions">
              <EditorialCta />
            </div>
          </div>
          <div className="ed-hero-art" aria-hidden="true">
            <picture>
              <source
                media="(forced-colors: active)"
                srcSet={`${assets}para-symbol-black.svg`}
              />
              <img
                src={`${assets}para-symbol-faceted.svg`}
                alt=""
                width={290}
                height={300}
                fetchPriority="high"
              />
            </picture>
          </div>
        </div>
      </section>
      <FeatureShowcase />
      <section className="ed-belief ed-wrap" aria-labelledby="ed-belief-title">
        <h2 id="ed-belief-title">
          <EditorialMotionText text="Feedback is a" />{" "}
          <em className="ed-signal-word">signal,</em>
          <br />
          <span className="ed-belief-secondary">
            <EditorialMotionText text="not a verdict." />
          </span>
        </h2>
        <svg
          className="ed-belief-route"
          viewBox="0 0 900 100"
          fill="none"
          aria-hidden="true"
        >
          <path d="M0 60H180C260 60 260 15 340 15S440 85 520 60S650 60 900 40" />
          <circle cx="520" cy="60" r="5" />
        </svg>
      </section>
      <section className="ed-close ed-wrap" aria-labelledby="ed-close-title">
        <h2 id="ed-close-title">
          <EditorialMotionText text="Hear it. Understand it. Play again." />
        </h2>
        <EditorialCta />
      </section>
      <footer className="ed-footer ed-wrap">
        <span>© {new Date().getFullYear()} PARA Music</span>
        <Link href="/product">Explore PARA</Link>
      </footer>
    </main>
  );
}
