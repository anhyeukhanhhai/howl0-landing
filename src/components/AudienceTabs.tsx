"use client";
import { useRef, useState } from "react";
const audience = [
  {
    name: "Teacher",
    title: "Keep homework and feedback connected.",
    copy: "Share a practice task in one link, then keep submissions and your response in the same conversation.",
    signal: "01 / ASSIGN → RESPOND",
  },
  {
    name: "Student",
    title: "Submit your practice without the platform headache.",
    copy: "Open the link, choose an audio or video recording you already have, and send your work.",
    signal: "02 / OPEN → SUBMIT",
  },
  {
    name: "Parent",
    title: "Support progress without managing the entire process.",
    copy: "Follow the next practice step with more clarity, while the student and teacher stay at the centre.",
    signal: "03 / UNDERSTAND → SUPPORT",
  },
];
export function AudienceTabs() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  function keyDown(e: React.KeyboardEvent<HTMLButtonElement>, i: number) {
    let next = i;
    if (e.key === "ArrowRight") next = (i + 1) % 3;
    else if (e.key === "ArrowLeft") next = (i + 2) % 3;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = 2;
    else return;
    e.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  }
  return (
    <div className={`audience-panel audience-${active}`}>
      <div
        className="tablist"
        role="tablist"
        aria-label="Audience perspectives"
      >
        {audience.map((a, i) => (
          <button
            key={a.name}
            ref={(el) => {
              refs.current[i] = el;
            }}
            id={`tab-${i}`}
            role="tab"
            aria-selected={active === i}
            aria-controls="audience-content"
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => keyDown(e, i)}
          >
            {a.name}
            <span aria-hidden="true">0{i + 1}</span>
          </button>
        ))}
      </div>
      <div
        id="audience-content"
        role="tabpanel"
        aria-labelledby={`tab-${active}`}
        tabIndex={0}
        className="audience-content"
      >
        <div>
          <span className="eyebrow">{audience[active].signal}</span>
          <h3>{audience[active].title}</h3>
          <p>{audience[active].copy}</p>
        </div>
        <div className="audience-art" aria-hidden="true">
          <div className="art-orbit">
            <img
              src="/brand/howl0/02-symbols/howl0-return-loop-master.svg"
              alt=""
            />
          </div>
          <span>{audience[active].name}</span>
        </div>
      </div>
    </div>
  );
}
