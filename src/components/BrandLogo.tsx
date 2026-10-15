/** Exact supplied refined PARA assets. No path, crop or colour modification. */
export function BrandLogo({
  width,
  height,
  className,
  footer = false,
}: {
  width: number;
  height: number;
  className?: string;
  footer?: boolean;
}) {
  return (
    <picture className="brand-logo">
      <source
        media="(prefers-color-scheme: dark)"
        srcSet="/brand/para/logo/PARA_White.svg"
      />
      <img
        className={className}
        src={
          footer
            ? "/brand/para/logo/PARA_Cocoa.svg"
            : "/brand/para/logo/PARA_Raspberry.svg"
        }
        alt="PARA"
        width={width}
        height={height}
      />
    </picture>
  );
}
