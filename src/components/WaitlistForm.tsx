"use client";
import { useState } from "react";
import { submitWaitlist } from "@/lib/waitlist";
export function WaitlistForm() {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [error, setError] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    setState("loading");
    setError("");
    try {
      await submitWaitlist({
        email: String(data.get("email") || ""),
        role: String(data.get("role") || ""),
        area: String(data.get("area") || ""),
        country: String(data.get("country") || ""),
        difficulty: String(data.get("difficulty") || ""),
      });
      setState("success");
      form.reset();
    } catch (err) {
      setState("error");
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    }
  }
  return (
    <form className="waitlist-form" onSubmit={submit} noValidate={false}>
      <p className="form-note">
        The waitlist is being connected. Submissions are not saved yet.
      </p>
      <div className="field">
        <label htmlFor="email">
          Email address <span aria-hidden="true">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
        />
      </div>
      <div className="field">
        <label htmlFor="role">Your role</label>
        <select id="role" name="role" defaultValue="">
          <option value="">Select a role</option>
          <option>Teacher</option>
          <option>Student</option>
          <option>Parent</option>
          <option>Other</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="area">
          Instrument or teaching area <span className="optional">optional</span>
        </label>
        <input id="area" name="area" placeholder="e.g. piano, voice, strings" />
      </div>
      <div className="field">
        <label htmlFor="country">
          Country <span className="optional">optional</span>
        </label>
        <input
          id="country"
          name="country"
          autoComplete="country-name"
          placeholder="Where are you based?"
        />
      </div>
      <div className="field">
        <label htmlFor="difficulty">
          Biggest homework or feedback difficulty{" "}
          <span className="optional">optional</span>
        </label>
        <textarea
          id="difficulty"
          name="difficulty"
          rows={3}
          placeholder="Tell us what gets in the way"
        />
      </div>
      <button
        className="button button-primary form-submit"
        disabled={state === "loading"}
        type="submit"
      >
        {state === "loading" ? "Checking availability…" : "Join the waitlist"}{" "}
        <span aria-hidden="true">↗</span>
      </button>
      <p className="form-status" role="status" aria-live="polite">
        {state === "error"
          ? error
          : state === "success"
            ? "You’re in the loop."
            : ""}
      </p>
    </form>
  );
}
