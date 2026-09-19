import Link from "next/link";

export function PageCta({
  eyebrow = "JOIN THE WAITLIST",
  title = "Help shape a clearer music-learning experience.",
}: {
  eyebrow?: string;
  title?: string;
}) {
  return (
    <section className="page-cta">
      <div className="wrap page-cta-inner">
        <div>
          <p className="eyebrow light">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
        <Link className="button button-light" href="/#waitlist">
          Join the waitlist <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </section>
  );
}
