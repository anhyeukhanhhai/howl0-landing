import type { CSSProperties } from "react";

/** Render supplied SVG geometry in the surrounding accessible text colour. */
export function ParaIcon({
  name,
  music = false,
}: {
  name: string;
  music?: boolean;
}) {
  const path = `/brand/para/icons/${music ? `music/para-icon-${name}` : `ui/para-ui-${name}`}.svg`;
  return (
    <span
      className={`para-icon ${music ? "music-icon" : ""}`}
      style={{ "--icon-url": `url("${path}")` } as CSSProperties}
      aria-hidden="true"
    />
  );
}
