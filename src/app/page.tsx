import { Navigation } from "@/components/Navigation";
import { HeroLoopPreview } from "@/components/HeroLoopPreview";
import { AudienceTabs } from "@/components/AudienceTabs";
import { WaitlistForm } from "@/components/WaitlistForm";
import { Faq } from "@/components/Faq";
import { ScatterSignal } from "@/components/ScatterSignal";
import { ScrollScene } from "@/components/ScrollScene";
import { PracticeLoop } from "@/components/PracticeLoop";
import { Reveal } from "@/components/Reveal";
const stages = [
  ["01", "Share", "The teacher creates homework and shares a link."],
  [
    "02",
    "Submit",
    "The student opens the link and uploads an existing audio or video recording.",
  ],
  [
    "03",
    "Respond",
    "The teacher reviews the submission and provides organised feedback.",
  ],
  ["04", "Improve", "The student understands what to practise next."],
];
export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navigation />
      <main id="main">
        <ScrollScene
          id="top"
          mode="pin"
          className="hero hero-scroll surface-noise"
        >
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <p className="eyebrow status">
                <span className="status-dot" /> Currently in development · Join
                our early community
              </p>
              <h1>
                Music homework,
                <br /> <em>shared and submitted</em>
                <br /> in one simple link<span className="period">.</span>
              </h1>
              <p className="hero-lead">
                howl0 is building a calmer way for teachers to assign practice,
                students to submit recordings, and families to stay connected to
                progress.
              </p>
              <div className="hero-actions">
                <a className="button button-primary" href="#waitlist">
                  Join the waitlist <span aria-hidden="true">↗</span>
                </a>
                <a className="text-link" href="#practice-loop">
                  Watch how it works <span aria-hidden="true">↘</span>
                </a>
              </div>
              <p className="hero-foot">
                A little less friction. A lot more room to learn.
              </p>
            </div>
            <div className="hero-visual">
              <div className="hero-loop">
                <img
                  src="/brand/howl0/02-symbols/howl0-return-loop-master.svg"
                  alt=""
                  fetchPriority="high"
                  aria-hidden="true"
                />
              </div>
              <HeroLoopPreview />
            </div>
          </div>
          <div className="hero-baseline wrap">
            <span>TEACHER</span>
            <div className="baseline-line" />
            <span>STUDENT</span>
          </div>
        </ScrollScene>
        <PracticeLoop />
        <ScrollScene
          id="why-howl0"
          mode="pin"
          className="problem problem-scroll dark-section surface-noise"
        >
          <div className="wrap problem-grid">
            <div>
              <p className="eyebrow light">02 / THE SPACE BETWEEN</p>
              <h2>
                Practice happens between lessons.{" "}
                <em>Feedback often gets lost there.</em>
              </h2>
              <p className="section-copy">
                Homework moves between messages, email, folders and recordings.
                howl0 is being designed to bring the practice conversation
                together.
              </p>
            </div>
            <ScatterSignal />
          </div>
          <div className="wave wave-apricot" aria-hidden="true">
            <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
              <path d="M0 55 C150 -15 270 125 440 54 S730 -10 895 55 S1170 125 1440 35" />
            </svg>
          </div>
        </ScrollScene>
        <section id="how-it-works" className="workflow section-pad">
          <div className="wrap">
            <Reveal className="section-intro" variant="fadeUp">
              <p className="eyebrow">03 / HOW IT WORKS</p>
              <h2>
                From assignment to improvement,{" "}
                <em>without the app-switching.</em>
              </h2>
              <p>Four connected moments. One clearer practice conversation.</p>
            </Reveal>
            <ol className="flow-list">
              {stages.map(([n, title, copy]) => (
                <li key={n}>
                  <div className="flow-node">
                    <span>{n}</span>
                    <i aria-hidden="true" />
                  </div>
                  <div>
                    <h3>{title}</h3>
                    <p>{copy}</p>
                  </div>
                  <span className="flow-arrow" aria-hidden="true">
                    ↗
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>
        <ScrollScene
          mode="pin"
          className="differentiator diff-scroll section-pad"
        >
          <div className="wrap">
            <p className="eyebrow">04 / THE ONE-LINK DIFFERENCE</p>
            <div className="diff-heading">
              <h2>
                Students shouldn’t need to learn a platform before they can{" "}
                <em>submit their learning.</em>
              </h2>
              <p>One link removes the search for where homework belongs.</p>
            </div>
            <div className="route-comparison">
              <div className="route old-route">
                <span className="route-label">THE FRAGMENTED ROUTE</span>
                <div className="route-steps">
                  <span>Find message</span>
                  <b>→</b>
                  <span>Locate instructions</span>
                  <b>→</b>
                  <span>Find upload destination</span>
                  <b>→</b>
                  <span>Send file</span>
                  <b>→</b>
                  <span>Wait for feedback</span>
                </div>
              </div>
              <div className="collapse-arrow" aria-hidden="true">
                ↓
              </div>
              <div className="route new-route">
                <span className="route-label">THE HOWL0 ROUTE</span>
                <div className="route-steps">
                  <span>Open link</span>
                  <b>→</b>
                  <span>Upload recording</span>
                  <b>→</b>
                  <span>Submit</span>
                </div>
                <div className="route-link">
                  howl0.link/practice <span aria-hidden="true">↗</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollScene>
        <section id="who-its-for" className="audiences section-pad">
          <div className="wrap">
            <Reveal className="section-intro" variant="fadeUp">
              <p className="eyebrow">05 / ONE LOOP, THREE VIEWS</p>
              <h2>
                One practice loop, <em>understood from every side.</em>
              </h2>
            </Reveal>
            <AudienceTabs />
          </div>
        </section>
        <ScrollScene
          id="our-belief"
          stages={4}
          className="belief belief-scroll surface-noise"
        >
          <div className="wrap belief-inner">
            <p className="eyebrow light">06 / OUR BELIEF</p>
            <h2>
              Feedback is a <em>signal,</em>
              <br />
              not a verdict.
            </h2>
            <p>
              A recording is not a final judgement of a student’s ability. It is
              one moment in an ongoing learning process.
            </p>
            <div className="belief-binary" aria-hidden="true">
              <span>RIGHT</span>
              <span>WRONG</span>
            </div>
            <div className="belief-wave" aria-hidden="true">
              <svg viewBox="0 0 1200 180" preserveAspectRatio="none">
                <path d="M0 100 C120 20 170 180 300 100 S480 20 600 100 S780 180 900 100 S1080 20 1200 100" />
              </svg>
            </div>
            <div className="feedback-markers">
              <span>What improved</span>
              <span>What to listen for</span>
              <span>What to practise next</span>
              <span>What to try differently</span>
            </div>
            <p className="belief-last">
              The signal keeps moving <span aria-hidden="true">↗</span>
            </p>
          </div>
        </ScrollScene>
        <section className="building section-pad">
          <div className="wrap building-grid">
            <div>
              <p className="eyebrow">07 / BUILDING IN THE OPEN</p>
              <h2>We’re building howl0 with music educators and learners.</h2>
              <p>
                howl0 is currently in development. We’re working with teachers,
                students, parents and music-learning communities to make
                homework submission and feedback genuinely easier.
              </p>
              <a className="text-link" href="#waitlist">
                Share your experience <span aria-hidden="true">↗</span>
              </a>
            </div>
            <div className="building-art" aria-hidden="true">
              <div>
                <img
                  src="/brand/howl0/02-symbols/howl0-return-loop-master.svg"
                  alt=""
                />
              </div>
              <span>LISTEN → ADJUST → GROW</span>
            </div>
          </div>
        </section>
        <ScrollScene
          id="waitlist"
          className="waitlist waitlist-scroll dark-section surface-noise"
        >
          <div className="wrap waitlist-grid">
            <div>
              <p className="eyebrow light">08 / STAY IN THE LOOP</p>
              <h2>
                Join the next <em>practice loop.</em>
              </h2>
              <p>
                Receive development updates and opportunities to participate in
                early testing.
              </p>
              <div className="waitlist-line" aria-hidden="true" />
            </div>
            <WaitlistForm />
          </div>
        </ScrollScene>
        <section id="faq" className="faq section-pad">
          <div className="wrap faq-grid">
            <div>
              <p className="eyebrow">09 / GOOD QUESTIONS</p>
              <h2>
                A little more <em>clarity.</em>
              </h2>
              <p>Here’s what we can share while howl0 takes shape.</p>
            </div>
            <Faq />
          </div>
        </section>
      </main>
      <footer className="footer">
        <div className="wrap">
          <div className="footer-main">
            <div>
              <a href="#top" aria-label="howl0, back to top">
                <img
                  src="/brand/howl0/01-logo/howl0-logo-master.svg"
                  alt="howl0"
                  width="150"
                  height="62"
                />
              </a>
              <p>Feedback is a signal, not a verdict.</p>
            </div>
            <div className="footer-links">
              <a href="#how-it-works">How it works</a>
              <a href="#who-its-for">Who it’s for</a>
              <a href="#waitlist">Join the waitlist</a>
              <a href="#faq">FAQ</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} howl0 · Pronounced Howl-lo</span>
            <span>
              Contact, privacy, terms and social channels: details coming soon.
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
