export type WaitlistEntry = {
  name: string;
  email: string;
};
export async function submitWaitlist(entry: WaitlistEntry): Promise<void> {
  // Development adapter: no data is transmitted or stored. Replace with a real HTTPS endpoint before launch.
  await new Promise((resolve) => setTimeout(resolve, 450));
  if (!entry.name.trim()) throw new Error("Enter your name.");
  if (!entry.email.trim()) throw new Error("Enter your email address.");
  throw new Error(
    "The waitlist is not accepting submissions yet. Please check back soon.",
  );
}
