"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { content as dictionaries, localePath, type Locale } from "@/lib/i18n";
import { audienceSignals } from "@/lib/para";
import { ParaFigure } from "@/components/ParaFigure";
import { ParaIcon } from "@/components/ParaIcon";

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
            <ParaFigure asset={audienceSignals[active]} locale={locale} />
            <div className="perspective-copy" key={active}>
              <p className="eyebrow">{content.items[active].name}</p>
              <h3>{dictionaries[locale].forYou.views[active].title}</h3>
              <p>{content.items[active].copy}</p>
              <Link
                className="text-link"
                href={localePath(locale, "/for-you")}
                prefetch={false}
              >
                {content.link}
                <ParaIcon name="arrow-right" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
