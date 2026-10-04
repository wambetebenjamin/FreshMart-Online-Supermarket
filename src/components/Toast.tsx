"use client";

import { useEffect, useState } from "react";
import { CircleCheck } from "lucide-react";

export function toast(message: string) {
  window.dispatchEvent(new CustomEvent("fm-toast", { detail: message }));
}

/** Single global toast, listening for `fm-toast` custom events. */
export default function ToastHost() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const handler = (e: Event) => {
      setMessage((e as CustomEvent<string>).detail);
      clearTimeout(timer);
      timer = setTimeout(() => setMessage(null), 2600);
    };
    window.addEventListener("fm-toast", handler);
    return () => {
      window.removeEventListener("fm-toast", handler);
      clearTimeout(timer);
    };
  }, []);

  if (!message) return null;
  return (
    <div className="fm-toast is-visible" role="status" aria-live="polite">
      <CircleCheck />
      <span>{message}</span>
    </div>
  );
}
