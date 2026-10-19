import type { ReactNode } from "react";

/** Keep the backdrop surface separate from foreground content. Animate the
 * surrounding scene wrapper, never opacity/filter on this material root. */
export function GlassLayers() {
  return (
    <>
      <span className="para-glass__surface" aria-hidden="true" />
      <span className="para-glass__texture" aria-hidden="true" />
      <span className="para-glass__rim" aria-hidden="true" />
    </>
  );
}

export function GlassSurface({
  children,
  material = "ivory",
  className = "",
  raised = false,
  rising = false,
}: {
  children?: ReactNode;
  material?: "ivory" | "smoke" | "quiet";
  className?: string;
  raised?: boolean;
  rising?: boolean;
}) {
  return (
    <div
      className={`para-glass para-glass--${material} ${raised ? "para-glass--raised" : ""} ${rising ? "para-glass--rising" : ""} ${className}`}
    >
      <GlassLayers />
      <div className="para-glass__content">{children}</div>
    </div>
  );
}
