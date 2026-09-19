import { AudienceTabs } from "@/components/AudienceTabs";
import { PageCta } from "@/components/PageCta";
import { PageHero } from "@/components/PageHero";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Who it’s for",
  "A connected music practice loop for teachers, students and parents.",
  "/who-its-for",
);

export default function WhoItsForPage() {
  return (
    <main id="main" className="page-enter">
      <PageHero
        eyebrow="WHO IT’S FOR"
        title={
          <>
            One loop, understood <em>from every side.</em>
          </>
        }
        intro="Teacher, student and parent each need a different view of the same practice journey."
      />
      <section className="audiences audience-page section-pad">
        <div className="wrap">
          <AudienceTabs />
        </div>
      </section>
      <PageCta title="Bring your view to the practice loop." />
    </main>
  );
}
