"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export default function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="fm-accordion">
      <button
        type="button"
        className="fm-acc-btn"
        aria-expanded={open}
        aria-controls={`panel-${title.replace(/\s+/g, "-").toLowerCase()}`}
        onClick={() => setOpen((v) => !v)}
      >
        {title}
        <ChevronDown />
      </button>
      {open && (
        <div className="fm-acc-panel" id={`panel-${title.replace(/\s+/g, "-").toLowerCase()}`}>
          {children}
        </div>
      )}
    </div>
  );
}
