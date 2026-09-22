/** The approved wordmark geometry, with palette colours suited to each surface. */
export function BrandLogo({
  width,
  height,
  className,
}: {
  width: number;
  height: number;
  className?: string;
}) {
  return (
    <picture className="brand-logo">
      <source
        media="(prefers-color-scheme: dark)"
        srcSet="/brand/howl0/01-logo/howl0-logo-dark.svg"
      />
      <img
        className={className}
        src="/brand/howl0/01-logo/howl0-logo-master.svg"
        alt="howl0"
        width={width}
        height={height}
      />
    </picture>
  );
}
