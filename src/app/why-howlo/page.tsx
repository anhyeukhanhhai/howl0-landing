import { BeliefMoment } from "@/components/BeliefMoment";
import { PageCta } from "@/components/PageCta";
import { PageHero } from "@/components/PageHero";
import { ScatterSignal } from "@/components/ScatterSignal";
import { ScrollScene } from "@/components/ScrollScene";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Why howl0",
  "Why howl0 is bringing scattered music homework and feedback into one connected practice loop.",
  "/why-howlo",
);

export default function WhyHowloPage() {
  return (
    <main id="main" className="page-enter">
      <PageHero
        eyebrow="WHY HOWL0"
        title={
          <>
            Practice happens <em>between lessons.</em>
          </>
        }
        intro="Homework and feedback often scatter across messages, email, files and recordings. howl0 is being designed to connect them."
        tone="dark"
      />
      <ScrollScene
        id="the-space-between"
        mode="pin"
        className="problem problem-scroll dark-section surface-noise"
      >
        <div className="wrap problem-grid">
          <div>
            <p className="eyebrow light">THE SPACE BETWEEN</p>
            <h2>
              Scattered pieces become <em>one practice signal.</em>
            </h2>
            <p className="section-copy">
              The task, recording and response stay connected.
            </p>
          </div>
          <ScatterSignal />
        </div>
        <div className="wave wave-apricot" aria-hidden="true">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
            <path d="M0 55 C150 -15 270 125 440 54 S730 -10 895 55 S1170 125 1440 35" />
          </svg>
        </div>
      </ScrollScene>
      <BeliefMoment />
      <PageCta title="Share what makes music homework difficult today." />
    </main>
  );
}
