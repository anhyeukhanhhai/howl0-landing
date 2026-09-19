import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "About",
  "howl0 is being developed with music educators and learners to make homework submission and feedback clearer.",
  "/about",
);

const ideas = [
  {
    label: "WHAT WE’RE BUILDING",
    title: "A calmer home for music homework.",
    copy: "Teachers share one link. Students submit an existing recording. Feedback stays connected to the next practice step.",
  },
  {
    label: "WHY WE’RE BUILDING IT",
    title: "The learning continues after the lesson.",
    copy: "Practice deserves a clearer conversation than scattered messages, folders and files can provide.",
  },
  {
    label: "OUR INITIAL FOCUS",
    title: "Music homework and feedback.",
    copy: "howl0 is currently in development with teachers, students, parents and music-learning communities.",
  },
] as const;

export default function AboutPage() {
  return (
    <main id="main" className="page-enter">
      <PageHero
        eyebrow="ABOUT HOWL0"
        title={
          <>
            Building in the open, <em>listening as we go.</em>
          </>
        }
        intro="howl0 is being developed with music educators and learners."
      >
        <div className="building-art about-loop" aria-hidden="true">
          <div>
            <img
              src="/brand/howl0/02-symbols/howl0-return-loop-master.svg"
              alt=""
            />
          </div>
          <span>LISTEN → ADJUST → GROW</span>
        </div>
      </PageHero>
      <section className="about-story section-pad">
        <div className="wrap about-story-list">
          {ideas.map((idea, index) => (
            <Reveal className="about-story-row" key={idea.label}>
              <span className="about-index">0{index + 1}</span>
              <div>
                <p className="eyebrow">{idea.label}</p>
                <h2>{idea.title}</h2>
              </div>
              <p>{idea.copy}</p>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="about-invitation surface-noise">
        <div className="wrap about-invitation-inner">
          <h2>Help make the practice loop easier.</h2>
          <p>Share your experience or join development updates.</p>
          <Link className="button button-primary" href="/#waitlist">
            Join the waitlist <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
