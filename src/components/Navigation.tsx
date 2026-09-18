"use client";
import { useState } from "react";
const items = [
  ["How it works", "#how-it-works"],
  ["Why howl0", "#why-howl0"],
  ["Who it’s for", "#who-its-for"],
  ["Our belief", "#our-belief"],
  ["FAQ", "#faq"],
];
export function Navigation() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <nav className="nav wrap" aria-label="Main navigation">
        <a className="brand" href="#top" aria-label="howl0, home">
          <img
            src="/brand/howl0/01-logo/howl0-logo-master.svg"
            alt="howl0"
            width="116"
            height="48"
          />
        </a>
        <button
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="nav-links"
          onClick={() => setOpen(!open)}
        >
          {open ? "Close" : "Menu"}
          <span aria-hidden="true">{open ? "×" : "☰"}</span>
        </button>
        <div id="nav-links" className={`nav-links ${open ? "open" : ""}`}>
          {items.map(([label, url]) => (
            <a key={url} href={url} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
          <a
            className="nav-cta"
            href="#waitlist"
            onClick={() => setOpen(false)}
          >
            Join the waitlist <span aria-hidden="true">↗</span>
          </a>
        </div>
      </nav>
    </header>
  );
}
