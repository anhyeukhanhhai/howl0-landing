import Link from "next/link";
import { content, homeHref, localePath, type Locale } from "@/lib/i18n";

export function SiteFooter({ locale }: { locale: Locale }) {
  const dictionary = content[locale];
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-main">
          <div>
            <a
              href={homeHref(locale)}
              aria-label={dictionary.navigation.homeLabel}
            >
              <img
                src="/brand/howl0/01-logo/howl0-logo-master.svg"
                alt="howl0"
                width="150"
                height="62"
              />
            </a>
            <p>{dictionary.footer.belief}</p>
          </div>
          <nav
            className="footer-links"
            aria-label={dictionary.footer.navigationLabel}
          >
            {dictionary.navigation.items.map(([label, href]) => (
              <Link href={localePath(locale, href)} key={href}>
                {label}
              </Link>
            ))}
            <a href={homeHref(locale, "#waitlist")}>
              {dictionary.navigation.waitlist}
            </a>
          </nav>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} howl0 ·{" "}
            {dictionary.footer.pronunciation}
          </span>
          <span>
            {dictionary.footer.status} · {dictionary.footer.contact}
          </span>
        </div>
      </div>
    </footer>
  );
}
