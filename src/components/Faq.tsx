const faqs = [
  [
    "What is howl0?",
    "howl0 (pronounced “Howl-lo”) is a music education learning platform in development. It is being designed to keep practice, homework, feedback and progress together between lessons.",
  ],
  ["Is howl0 available now?", "Not yet. howl0 is currently in development."],
  [
    "Who is it for?",
    "Music educators are the primary focus. Students and parents support the learning journey around them.",
  ],
  [
    "How do students receive homework?",
    "The first experience is a teacher sharing a task through an existing communication channel or a howl0 class.",
  ],
  [
    "What can students submit?",
    "The planned flow lets a student upload an existing audio or video recording.",
  ],
  [
    "Do students need to download an app?",
    "The intended first submission flow opens in a browser and does not require an app download.",
  ],
  [
    "When will howl0 launch?",
    "There is no announced launch date. Development updates will be shared when available.",
  ],
  [
    "Is joining the waitlist free?",
    "No payment is requested to express interest. The waitlist form is being connected and is not collecting submissions yet.",
  ],
];
export function Faq() {
  return (
    <div className="faq-list">
      {faqs.map(([q, a], i) => (
        <details key={q}>
          <summary>
            <span className="faq-number">{String(i + 1).padStart(2, "0")}</span>
            <span>{q}</span>
            <span className="faq-plus" aria-hidden="true">
              +
            </span>
          </summary>
          <p>{a}</p>
        </details>
      ))}
    </div>
  );
}
