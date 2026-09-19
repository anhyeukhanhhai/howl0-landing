"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";

const items = [
  ["How it works", "/how-it-works"],
  ["Why howl0", "/why-howlo"],
  ["Who it’s for", "/who-its-for"],
  ["About", "/about"],
  ["FAQ", "/faq"],
] as const;

export function Navigation() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const toggle = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);

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
      <nav className="nav wrap" aria-label="Main navigation">
        <Link className="brand" href="/" aria-label="howl0, home">
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
          {open ? "Close" : "Menu"}
          <span aria-hidden="true">{open ? "×" : "☰"}</span>
        </button>
        <div
          id="nav-links"
          className={`nav-links ${open ? "open" : ""}`}
          onKeyDown={handleMenuKeyDown}
        >
          {items.map(([label, url], index) => (
            <Link
              key={url}
              ref={index === 0 ? firstLink : undefined}
              href={url}
              aria-current={pathname === url ? "page" : undefined}
              onClick={closeMenu}
            >
              {label}
            </Link>
          ))}
          <Link className="nav-cta" href="/#waitlist" onClick={closeMenu}>
            Join the waitlist <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
