"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { content, localePath, type Locale } from "@/lib/i18n";

export function Navigation({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const dictionary = content[locale].navigation;
  const toggle = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);

  const plainPath = pathname.replace(/^\/vi(?=\/|$)/, "") || "/";
  const languageHref =
    locale === "en" ? localePath("vi", plainPath) : plainPath;

  function toggleMenu() {
    setOpen((current) => {
      const next = !current;
      if (next) requestAnimationFrame(() => firstLink.current?.focus());
      return next;
    });
  }

  function closeMenu() {
    setOpen(false);
  }

  function handleMenuKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Escape") return;
    event.preventDefault();
    setOpen(false);
    toggle.current?.focus();
  }

  return (
    <header className="site-header">
      <nav className="nav wrap" aria-label={dictionary.label}>
        <Link
          className="brand"
          href={localePath(locale, "/")}
          aria-label={dictionary.homeLabel}
        >
          <img
            src="/brand/howl0/01-logo/howl0-logo-master.svg"
            alt="howl0"
            width="116"
            height="48"
          />
        </Link>
        <button
          ref={toggle}
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="nav-links"
          onClick={toggleMenu}
        >
          {open ? dictionary.close : dictionary.menu}
          <span aria-hidden="true">{open ? "×" : "☰"}</span>
        </button>
        <div
          id="nav-links"
          className={`nav-links ${open ? "open" : ""}`}
          onKeyDown={handleMenuKeyDown}
        >
          {dictionary.items.map(([label, url], index) => {
            const href = localePath(locale, url);
            return (
              <Link
                key={url}
                ref={index === 0 ? firstLink : undefined}
                href={href}
                aria-current={pathname === href ? "page" : undefined}
                onClick={closeMenu}
              >
                {label}
              </Link>
            );
          })}
          <Link
            className="language-switch"
            href={languageHref}
            hrefLang={locale === "en" ? "vi" : "en"}
            lang={locale === "en" ? "vi" : "en"}
            aria-label={dictionary.languageLabel}
            onClick={closeMenu}
          >
            <span aria-hidden="true">EN / VI</span>
            <strong>{dictionary.languageShort}</strong>
          </Link>
          <Link
            className="nav-cta"
            href={`${localePath(locale, "/")}#waitlist`}
            onClick={closeMenu}
          >
            {dictionary.waitlist} <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
