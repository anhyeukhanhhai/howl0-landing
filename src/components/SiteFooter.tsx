import Link from "next/link";

const links = [
  ["How it works", "/how-it-works"],
  ["Why howl0", "/why-howlo"],
  ["Who it’s for", "/who-its-for"],
  ["About", "/about"],
  ["FAQ", "/faq"],
] as const;

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-main">
          <div>
            <Link href="/" aria-label="howl0, home">
              <img
                src="/brand/howl0/01-logo/howl0-logo-master.svg"
                alt="howl0"
                width="150"
                height="62"
              />
            </Link>
            <p>Feedback is a signal, not a verdict.</p>
          </div>
          <nav className="footer-links" aria-label="Footer navigation">
            {links.map(([label, href]) => (
              <Link href={href} key={href}>
                {label}
              </Link>
            ))}
            <Link href="/#waitlist">Join the waitlist</Link>
          </nav>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} howl0 · Pronounced Howl-lo</span>
          <span>
            Contact, privacy, terms and social channels: details coming soon.
          </span>
        </div>
      </div>
    </footer>
  );
}
