"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import {
  content,
  homeHref,
  languageChoiceHref,
  localePath,
  type Locale,
} from "@/lib/i18n";

export function Navigation({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const dictionary = content[locale].navigation;
  const toggle = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);

  useLayoutEffect(() => {
    if (open) firstLink.current?.focus();
  }, [open]);

  const plainPath = pathname.replace(/^\/vi(?=\/|$)/, "") || "/";
  const languageHref = languageChoiceHref(
    locale === "en" ? "vi" : "en",
    plainPath,
  );

  function toggleMenu() {
    setOpen((current) => !current);
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
        <a
          className="brand"
          href={homeHref(locale)}
          aria-label={dictionary.homeLabel}
        >
          <BrandLogo width={116} height={48} />
        </a>
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
          <a
            className="language-switch"
            href={languageHref}
            hrefLang={locale === "en" ? "vi" : "en"}
            lang={locale === "en" ? "vi" : "en"}
            aria-label={dictionary.languageLabel}
            onClick={closeMenu}
          >
            <span aria-hidden="true">EN / VI</span>
            <strong>{dictionary.languageShort}</strong>
          </a>
          <a
            className="nav-cta"
            href={homeHref(locale, "#waitlist")}
            onClick={closeMenu}
          >
            {dictionary.waitlist} <span aria-hidden="true">↗</span>
          </a>
        </div>
      </nav>
    </header>
  );
}
