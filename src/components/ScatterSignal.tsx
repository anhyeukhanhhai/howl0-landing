const fragments = [
  ["Homework instructions", "item-1"],
  ["Message thread", "item-2"],
  ["Audio file", "item-3"],
  ["Video recording", "item-4"],
  ["Sheet music", "item-5"],
  ["Comments", "item-6"],
];
export function ScatterSignal() {
  return (
    <div
      className="scatter"
      role="img"
      aria-label="Homework instructions, messages, recordings, sheet music and comments converge into one connected howl0 practice link"
    >
      {fragments.map(([label, cls]) => (
        <span key={label} className={`scatter-item ${cls}`}>
          {label}
        </span>
      ))}
      <div className="scatter-centre">
        <img
          src="/brand/howl0/02-symbols/howl0-return-loop-master.svg"
          alt=""
        />
        <span className="scatter-link">howl0.link/practice</span>
      </div>
    </div>
  );
}
