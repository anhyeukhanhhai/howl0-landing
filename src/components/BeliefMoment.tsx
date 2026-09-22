import { ScrollScene } from "@/components/ScrollScene";

export function BeliefMoment({
  content,
  compact = false,
}: {
  content: {
    eyebrow: string;
    title: string;
    copy: string;
    labels: readonly string[];
  };
  compact?: boolean;
}) {
  return (
    <ScrollScene
      id="belief"
      stages={4}
      className={`belief belief-scroll surface-noise ${compact ? "belief-compact" : ""}`}
    >
      <div className="wrap belief-inner">
        <p className="eyebrow light">{content.eyebrow}</p>
        <h2>{content.title}</h2>
        <p>{content.copy}</p>
        <div className="belief-wave" aria-hidden="true">
          <svg viewBox="0 0 1200 180" preserveAspectRatio="none">
            <path d="M0 100 C120 20 170 180 300 100 S480 20 600 100 S780 180 900 100 S1080 20 1200 100" />
          </svg>
        </div>
        <div className="feedback-markers">
          {content.labels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </div>
    </ScrollScene>
  );
}
