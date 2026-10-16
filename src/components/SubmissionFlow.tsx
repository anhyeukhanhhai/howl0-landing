import { content, type Locale } from "@/lib/i18n";
import { paraContent } from "@/lib/para";
import { ParaIcon } from "@/components/ParaIcon";
import { Reveal } from "@/components/Reveal";

const icons = [
  "assignment",
  "listening",
  "audio-recording",
  "teacher-feedback",
  "next-practice-step",
];

export function SubmissionFlow({
  locale,
  active = 0,
}: {
  locale: Locale;
  active?: number;
}) {
  const page = content[locale].home.loop;
  const extra = paraContent[locale];
  return (
    <section
      id="submission-flow"
      className="submission-flow section-pad"
      aria-labelledby="submission-flow-heading"
    >
      <div className="wrap">
        <Reveal className="section-heading-grid">
          <div>
            <p className="eyebrow">{page.eyebrow}</p>
            <h2 id="submission-flow-heading">{page.title}</h2>
          </div>
          <p>{page.copy}</p>
        </Reveal>
        <ol className="submission-sequence">
          {page.steps.map(([number, label], index) => (
            <li
              key={label}
              aria-current={active === index ? "step" : undefined}
            >
              <span className="submission-number">{number}</span>
              <ParaIcon name={icons[index]} music />
              <h3>{label}</h3>
              <p>{extra.details[index]}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
