"use client";
import { useEffect, useState } from "react";
const steps = [
  {
    label: "Create",
    title: "A teacher sets a practice task.",
    detail: "A clear assignment begins the loop.",
    symbol: "01",
  },
  {
    label: "Link",
    title: "One howl0 link is ready to share.",
    detail: "A simple way into the homework.",
    symbol: "02",
  },
  {
    label: "Share",
    title: "Send it in messages, email, or a howl0 class.",
    detail: "Use the route that works for your community.",
    symbol: "03",
  },
  {
    label: "Open",
    title: "The student opens the link.",
    detail: "No platform learning curve first.",
    symbol: "04",
  },
  {
    label: "Select",
    title: "Choose an existing audio or video recording.",
    detail: "A practice moment becomes a submission.",
    symbol: "05",
  },
  {
    label: "Submit",
    title: "The recording reaches the teacher.",
    detail: "Homework stays connected to its task.",
    symbol: "06",
  },
  {
    label: "Respond",
    title: "The teacher gives organised feedback.",
    detail: "A useful signal travels back.",
    symbol: "07",
  },
  {
    label: "Improve",
    title: "The next practice step becomes clearer.",
    detail: "Share → Practise → Submit → Respond → Improve",
    symbol: "08",
  },
];
export function HeroMotion() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReduced(q.matches);
      if (q.matches) setPlaying(false);
    };
    update();
    q.addEventListener("change", update);
    return () => q.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (!playing || reduced) return;
    const timer = window.setInterval(
      () =>
        setIndex((i) => {
          if (i === 7) {
            setPlaying(false);
            return i;
          }
          return i + 1;
        }),
      2500,
    );
    return () => window.clearInterval(timer);
  }, [playing, reduced]);
  return (
    <div
      id="motion"
      className="motion"
      aria-label="How one homework link connects a practice loop"
    >
      <div className="motion-top">
        <span className="eyebrow">THE PRACTICE LOOP / 20 SECONDS</span>
        <span className="motion-counter">
          {String(index + 1).padStart(2, "0")} / 08
        </span>
      </div>
      {reduced ? (
        <div className="motion-static">
          <p className="motion-title">One link. A clearer practice loop.</p>
          <ol>
            {steps.map((s) => (
              <li key={s.label}>
                <strong>{s.label}</strong>
                <span>{s.title}</span>
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <div className="motion-scene">
          <div className="motion-glyph" aria-hidden="true">
            <img
              src="/brand/howl0/02-symbols/howl0-return-loop-master.svg"
              alt=""
            />
            <div className="motion-link">howl0.link/practice</div>
          </div>
          <div className="motion-copy" aria-live="polite" aria-atomic="true">
            <span className="eyebrow">
              {steps[index].symbol} / {steps[index].label}
            </span>
            <p className="motion-title">{steps[index].title}</p>
            <p>{steps[index].detail}</p>
          </div>
        </div>
      )}
      <div className="motion-footer">
        <span>One link. A clearer practice loop.</span>
        <div className="motion-controls">
          {!reduced && (
            <button
              onClick={() => {
                if (index === 7) setIndex(0);
                setPlaying(!playing);
              }}
              aria-label={playing ? "Pause animation" : "Play animation"}
            >
              {playing ? "Pause" : "Play"}{" "}
              <span aria-hidden="true">{playing ? "Ⅱ" : "▶"}</span>
            </button>
          )}
          <button
            onClick={() => {
              setIndex(0);
              setPlaying(!reduced);
            }}
            aria-label="Replay animation"
          >
            Replay <span aria-hidden="true">↺</span>
          </button>
        </div>
      </div>
      <div className="progress-track" aria-hidden="true">
        <span style={{ width: `${(index + 1) * 12.5}%` }} />
      </div>
    </div>
  );
}
