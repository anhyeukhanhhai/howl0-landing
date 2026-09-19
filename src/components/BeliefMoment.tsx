import { ScrollScene } from "@/components/ScrollScene";

export function BeliefMoment({ compact = false }: { compact?: boolean }) {
  return (
    <ScrollScene
      id="belief"
      stages={4}
      className={`belief belief-scroll surface-noise ${compact ? "belief-compact" : ""}`}
    >
      <div className="wrap belief-inner">
        <p className="eyebrow light">OUR BELIEF</p>
        <h2>
          Feedback is a <em>signal,</em>
          <br />
          not a verdict.
        </h2>
        <p>
          Every submission is one moment in a longer learning journey. howl0
          keeps feedback connected to what the student should practise next.
        </p>
        <div className="belief-binary" aria-hidden="true">
          <span>RIGHT</span>
          <span>WRONG</span>
        </div>
        <div className="belief-wave" aria-hidden="true">
          <svg viewBox="0 0 1200 180" preserveAspectRatio="none">
            <path d="M0 100 C120 20 170 180 300 100 S480 20 600 100 S780 180 900 100 S1080 20 1200 100" />
          </svg>
        </div>
        <div className="feedback-markers">
          <span>What improved</span>
          <span>What to listen for</span>
          <span>What to practise next</span>
          <span>What to try differently</span>
        </div>
        <p className="belief-last">
          The signal keeps moving <span aria-hidden="true">↗</span>
        </p>
      </div>
    </ScrollScene>
  );
}
