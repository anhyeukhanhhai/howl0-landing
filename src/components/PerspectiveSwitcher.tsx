"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n";

export function PerspectiveSwitcher({
  locale,
  content,
}: {
  locale: Locale;
  content: {
    eyebrow: string;
    title: string;
    items: readonly { readonly name: string; readonly copy: string }[];
    link: string;
  };
}) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function keyDown(
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % content.items.length;
    else if (event.key === "ArrowLeft")
      next = (index + content.items.length - 1) % content.items.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = content.items.length - 1;
    else return;
    event.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  }

  return (
    <section className="home-perspectives section-pad surface-noise">
      <div className="wrap perspectives-grid">
        <div>
          <p className="eyebrow">{content.eyebrow}</p>
          <h2>{content.title}</h2>
          <Link className="text-link" href={localePath(locale, "/for-you")}>
            {content.link} <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="perspective-switcher">
          <div
            className="perspective-tabs"
            role="tablist"
            aria-label={content.eyebrow}
          >
            {content.items.map((item, index) => (
              <button
                key={item.name}
                ref={(node) => {
                  refs.current[index] = node;
                }}
                id={`perspective-tab-${index}`}
                role="tab"
                aria-selected={active === index}
                aria-controls="perspective-panel"
                tabIndex={active === index ? 0 : -1}
                onClick={() => setActive(index)}
                onKeyDown={(event) => keyDown(event, index)}
              >
                <span>0{index + 1}</span>
                {item.name}
              </button>
            ))}
          </div>
          <div
            id="perspective-panel"
            className="perspective-panel"
            role="tabpanel"
            tabIndex={0}
            aria-labelledby={`perspective-tab-${active}`}
          >
            <strong>{content.items[active].name}</strong>
            <p>{content.items[active].copy}</p>
            <div className="perspective-orbit" aria-hidden="true">
              <img
                src="/brand/howl0/02-symbols/howl0-return-loop-master.svg"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
