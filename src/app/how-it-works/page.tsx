import { PageCta } from "@/components/PageCta";
import { PageHero } from "@/components/PageHero";
import { PracticeLoop } from "@/components/PracticeLoop";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "How it works",
  "See how a simple howl0 submission flow carries a music teacher’s task to a student recording, response and next attempt.",
  "/how-it-works",
);

export default function HowItWorksPage() {
  return (
    <main id="main" className="page-enter">
      <PageHero
        eyebrow="HOW IT WORKS"
        title={
          <>
            A simple start for the learning <em>between lessons.</em>
          </>
        }
        intro="A teacher shares a task. A student uploads an existing audio or video file. The response guides the next attempt."
      >
        <div className="page-signal-mark" aria-hidden="true">
          <img
            src="/brand/howl0/02-symbols/howl0-return-loop-master.svg"
            alt=""
          />
          <span>howl0.link/practice ↗</span>
        </div>
      </PageHero>
      <PracticeLoop eyebrow="THE SUBMISSION JOURNEY" />
      <section className="flow-next section-pad">
        <div className="wrap flow-next-inner">
          <p className="eyebrow">WHAT COMES NEXT</p>
          <h2>The submission flow opens into a wider learning environment.</h2>
          <p>
            howl0 is being built to give teachers and students a clearer place
            to continue from there.
          </p>
          <Link className="text-link" href="/product">
            Explore the product vision <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
      <PageCta title="Help shape the future of music learning." />
    </main>
  );
}
import Link from "next/link";
