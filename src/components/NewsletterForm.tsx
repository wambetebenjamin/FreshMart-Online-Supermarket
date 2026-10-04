"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

/** Footer newsletter signup → /api/newsletter. */
export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <p className="fm-newsletter-note" style={{ color: "var(--fm-brand)", fontWeight: 700 }}>
        <Mail size={12} style={{ display: "inline", marginRight: 4, verticalAlign: -1 }} />
        You’re in! Weekly fresh deals coming your way.
      </p>
    );
  }

  return (
    <form className="fm-newsletter" onSubmit={submit}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email address"
        aria-label="Email address for newsletter"
      />
      <button type="submit" disabled={status === "sending"}>
        {status === "sending" ? "…" : "Subscribe"}
      </button>
    </form>
  );
}
