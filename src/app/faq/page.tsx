import { Faq } from "@/components/Faq";
import { PageHero } from "@/components/PageHero";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "FAQ",
  "Direct answers about howl0, its one-link music homework flow and current development status.",
  "/faq",
);

export default function FaqPage() {
  return (
    <main id="main" className="page-enter">
      <PageHero
        eyebrow="GOOD QUESTIONS"
        title={
          <>
            A little more <em>clarity.</em>
          </>
        }
        intro="What we can share while howl0 takes shape."
      />
      <section className="faq faq-page section-pad">
        <div className="wrap faq-page-grid">
          <p className="faq-aside">
            howl0 is currently in development. These answers reflect the
            intended experience today.
          </p>
          <Faq />
        </div>
      </section>
    </main>
  );
}
