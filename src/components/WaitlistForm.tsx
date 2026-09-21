"use client";
import { useState } from "react";
import { submitWaitlist } from "@/lib/waitlist";
import { content, type Locale } from "@/lib/i18n";

export function WaitlistForm({ locale }: { locale: Locale }) {
  const dictionary = content[locale].waitlist;
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
        name: String(data.get("name") || ""),
        email: String(data.get("email") || ""),
      });
      setState("success");
      form.reset();
    } catch (err) {
      setState("error");
      setError(
        err instanceof Error ? dictionary.error : dictionary.genericError,
      );
    }
  }
  return (
    <form className="waitlist-form" onSubmit={submit} noValidate={false}>
      <p className="form-note">{dictionary.unavailable}</p>
      <div className="field">
        <label htmlFor="waitlist-name">
          {dictionary.nameLabel} <span aria-hidden="true">*</span>
        </label>
        <input
          id="waitlist-name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder={dictionary.namePlaceholder}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="email">
          {dictionary.emailLabel} <span aria-hidden="true">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder={dictionary.emailPlaceholder}
          required
        />
      </div>
      <button
        className="button button-primary form-submit"
        disabled={state === "loading"}
        type="submit"
      >
        {state === "loading" ? dictionary.loading : dictionary.button}{" "}
        <span aria-hidden="true">↗</span>
      </button>
      <p className="consent-note">{dictionary.consent}</p>
      <p className="form-status" role="status" aria-live="polite">
        {state === "error"
          ? error
          : state === "success"
            ? dictionary.success
            : ""}
      </p>
    </form>
  );
}
