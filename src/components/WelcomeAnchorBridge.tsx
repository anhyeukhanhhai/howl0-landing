"use client";
import { useEffect } from "react";

export function WelcomeAnchorBridge() {
  useEffect(() => {
    if (window.location.hash === "#waitlist") {
      window.location.replace("/choose-language/en?next=%2F%23waitlist");
    }
  }, []);
  return null;
}
