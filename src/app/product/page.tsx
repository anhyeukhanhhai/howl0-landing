import Link from "next/link";
import { PageCta } from "@/components/PageCta";
import { PageHero } from "@/components/PageHero";
import { PlatformReveal } from "@/components/PlatformReveal";
import { Reveal } from "@/components/Reveal";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Product",
  "The product vision for howl0, a learning platform in development for music education.",
  "/product",
);

export default function ProductPage() {
  return (
    <main id="main" className="page-enter">
      <PageHero
        eyebrow="PRODUCT"
        title={
          <>
            A learning platform designed around how music{" "}
            <em>actually happens.</em>
          </>
        }
        intro="Lessons may happen once a week. Learning continues every day. howl0 is being built to connect everything that happens between them."
      >
        <div className="page-signal-mark product-hero-art" aria-hidden="true">
          <img
            src="/brand/howl0/02-symbols/howl0-return-loop-master.svg"
            alt=""
          />
          <span>LESSON → LEARNING → NEXT STEP</span>
        </div>
      </PageHero>
      <section className="product-story section-pad">
        <div className="wrap product-story-grid">
          <Reveal>
            <p className="eyebrow">THE PRODUCT VISION</p>
            <h2>Learning keeps moving after the lesson.</h2>
          </Reveal>
          <Reveal>
            <p>
              howl0 begins where most music learning becomes scattered: the work
              between lessons. A simple submission flow gives teachers and
              students an easier place to start.
            </p>
            <Link className="text-link" href="/how-it-works">
              See the submission flow <span aria-hidden="true">↗</span>
            </Link>
          </Reveal>
        </div>
      </section>
      <PlatformReveal showLink={false} />
      <section className="teacher-principle surface-noise">
        <div className="wrap">
          <p className="eyebrow light">A CLEAR PRINCIPLE</p>
          <h2>
            Technology should carry a teacher’s guidance forward,{" "}
            <em>not replace it.</em>
          </h2>
        </div>
      </section>
      <PageCta title="Help shape a learning platform built for music." />
    </main>
  );
}
