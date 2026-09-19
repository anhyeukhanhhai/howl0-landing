import { AudienceTabs } from "@/components/AudienceTabs";
import { PageCta } from "@/components/PageCta";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "For educators",
  "howl0 is being built to help music educators carry homework, guidance and progress between lessons.",
  "/for-educators",
);

export default function ForEducatorsPage() {
  return (
    <main id="main" className="page-enter">
      <PageHero
        eyebrow="FOR EDUCATORS"
        title={
          <>
            Spend less time finding homework and more time{" "}
            <em>guiding improvement.</em>
          </>
        }
        intro="howl0 is being built around the work music teachers do before, during and after each lesson."
      />
      <section className="audiences audience-page section-pad">
        <div className="wrap">
          <Reveal className="educators-intro">
            <p className="eyebrow">THE TEACHER AT THE CENTRE</p>
            <h2>Keep guidance easy to carry forward.</h2>
            <p>
              Students and parents have a role in the journey. Teachers set the
              direction.
            </p>
          </Reveal>
          <AudienceTabs />
        </div>
      </section>
      <PageCta title="Help shape a platform built for music educators." />
    </main>
  );
}
