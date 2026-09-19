import { WaitlistForm } from "@/components/WaitlistForm";
import { ScrollScene } from "@/components/ScrollScene";

export function WaitlistSection() {
  return (
    <ScrollScene
      id="waitlist"
      className="waitlist waitlist-scroll dark-section surface-noise"
    >
      <div className="wrap waitlist-grid">
        <div>
          <p className="eyebrow light">STAY IN THE LOOP</p>
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
  );
}
