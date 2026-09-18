"use client";
import { useEffect, useRef, useState } from "react";
const fragments = [
  ["Homework instructions", "item-1"],
  ["Message thread", "item-2"],
  ["Audio file", "item-3"],
  ["Video recording", "item-4"],
  ["Sheet music", "item-5"],
  ["Comments", "item-6"],
];
export function ScatterSignal() {
  const ref = useRef<HTMLDivElement>(null);
  const [joined, setJoined] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setJoined(true);
      },
      { threshold: 0.65 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`scatter ${joined ? "is-joined" : ""}`}
      role="img"
      aria-label="Scattered homework instructions, messages, recordings, sheet music and comments coming together as one practice signal"
    >
      {fragments.map(([label, cls]) => (
        <span key={label} className={`scatter-item ${cls}`}>
          {label}
        </span>
      ))}
      <div className="scatter-centre">
        <span>
          One connected
          <br />
          practice signal
        </span>
        <img
          src="/brand/howl0/02-symbols/howl0-return-loop-master.svg"
          alt=""
        />
      </div>
    </div>
  );
}
