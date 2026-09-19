import { PageCta } from "@/components/PageCta";
import { PageHero } from "@/components/PageHero";
import { PracticeLoop } from "@/components/PracticeLoop";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "How it works",
  "See how one howl0 link connects a teacher’s task, a student recording and clear feedback.",
  "/how-it-works",
);

export default function HowItWorksPage() {
  return (
    <main id="main" className="page-enter">
      <PageHero
        eyebrow="HOW IT WORKS"
        title={
          <>
            One link keeps <em>practice moving.</em>
          </>
        }
        intro="A teacher shares the task. A student submits a recording. Feedback returns with a clearer next step."
      >
        <div className="page-signal-mark" aria-hidden="true">
          <img
            src="/brand/howl0/02-symbols/howl0-return-loop-master.svg"
            alt=""
          />
          <span>howl0.link/practice ↗</span>
        </div>
      </PageHero>
      <PracticeLoop />
      <PageCta title="A clearer practice loop starts with one link." />
    </main>
  );
}
