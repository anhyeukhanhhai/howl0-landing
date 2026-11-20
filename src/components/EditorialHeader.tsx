import Link from "next/link";
import { PRODUCT_URL } from "@/lib/product";
import "@/app/editorial-home.css";

export function EditorialArrow() {
  return (
    <img
      src="/brand/para/homepage/arrow-right.svg"
      alt=""
      width={20}
      height={20}
    />
  );
}

export function EditorialCta() {
  return (
    <a className="ed-button" href={PRODUCT_URL}>
      Try for free <EditorialArrow />
    </a>
  );
}

export function EditorialHeader() {
  return (
    <header className="ed-header">
      <nav className="ed-wrap ed-nav" aria-label="Main navigation">
        <Link className="ed-brand" href="/" aria-label="PARA Music, home">
          <img
            src="/brand/para/homepage/para-horizontal-black.svg"
            alt="PARA"
            width={1106}
            height={300}
          />
        </Link>
        <div className="ed-nav-actions">
          <a className="ed-nav-story" href="#how-it-works">
            How it works
          </a>
          <EditorialCta />
        </div>
      </nav>
    </header>
  );
}
