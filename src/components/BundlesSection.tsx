"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Repeat, X } from "lucide-react";
import Modal from "./Modal";
import { bundles } from "@/lib/data";
import { formatKES } from "@/lib/utils";
import { blurFor } from "@/lib/blur-map";
import { WHATSAPP_HELP_URL } from "@/lib/utils";
import { WhatsAppIcon } from "./BrandIcons";

/** Weekly subscription bundles — /api/subscribe saves + notifies on WhatsApp. */
export default function BundlesSection() {
  const [modalBundle, setModalBundle] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", address: "", day: "Monday" });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const bundle = bundles.find((b) => b.slug === modalBundle);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bundle) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, bundle: bundle.slug }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <div className="fm-bundles">
        {bundles.map((b) => (
          <article className="bundle-card" key={b.slug}>
            <div className="bundle-img">
              <Image
                src={b.image}
                alt={b.name}
                fill
                sizes="(max-width: 991px) 92vw, 380px"
                placeholder="blur"
                blurDataURL={blurFor(b.image)}
              />
            </div>
            <div className="bundle-body">
              <h3 className="bundle-name">{b.name}</h3>
              <p className="bundle-blurb">{b.blurb}</p>
              <ul className="bundle-contents">
                {b.contents.map((item) => (
                  <li key={item}>
                    <Check size={14} /> {item}
                  </li>
                ))}
              </ul>
              <span className="bundle-saves">{b.saves}</span>
              <div className="bundle-price-row">
                <span className="bundle-price">{formatKES(b.price)}</span>
                <span className="bundle-cadence">per week · pause or cancel any time</span>
              </div>
              <button
                type="button"
                className="btn btn-brand btn-block"
                onClick={() => {
                  setModalBundle(b.slug);
                  setStatus("idle");
                }}
              >
                <Repeat size={14} /> Subscribe Weekly
              </button>
            </div>
          </article>
        ))}
      </div>

      <Modal
        open={modalBundle !== null}
        onClose={() => setModalBundle(null)}
        title={bundle ? `Subscribe — ${bundle.name}` : ""}
      >
        {status === "done" ? (
          <div style={{ textAlign: "center", padding: "12px 4px" }}>
            <Check
              size={44}
              style={{ color: "var(--fm-brand)", margin: "0 auto 14px", display: "block" }}
            />
            <h3 style={{ marginBottom: 8 }}>You’re subscribed! 🧺</h3>
            <p style={{ fontSize: 14 }}>
              Your <strong>{bundle?.name}</strong> arrives every week. We’ve sent the details to
              FreshMart on WhatsApp and saved your subscription.
            </p>
            <a className="btn btn-brand btn-block" style={{ marginTop: 16 }} href={WHATSAPP_HELP_URL} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon size={15} /> Message FreshMart on WhatsApp
            </a>
          </div>
        ) : (
          <form onSubmit={submit}>
            <p style={{ fontSize: 14, color: "var(--fm-muted)", marginTop: 0 }}>
              {bundle?.name} — {bundle ? formatKES(bundle.price) : ""} weekly. Pause or cancel any time.
            </p>
            <div className="fm-field">
              <label htmlFor="sub-name">Full name</label>
              <input
                id="sub-name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Wanjiru Kamau"
              />
            </div>
            <div className="fm-field">
              <label htmlFor="sub-phone">Phone (M-Pesa number)</label>
              <input
                id="sub-phone"
                required
                inputMode="tel"
                pattern="[0-9+ ]{9,15}"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="07XX XXX XXX"
              />
            </div>
            <div className="fm-field">
              <label htmlFor="sub-address">Delivery address</label>
              <input
                id="sub-address"
                required
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Estate, road, house / floor"
              />
            </div>
            <div className="fm-field">
              <label htmlFor="sub-day">Weekly delivery day</label>
              <select id="sub-day" value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })}>
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            {status === "error" && (
              <p className="fm-error" role="alert">
                Something went wrong — please try again or WhatsApp us.
              </p>
            )}
            <button type="submit" className="btn btn-brand btn-block" disabled={status === "sending"}>
              {status === "sending" ? "Subscribing…" : "Confirm Weekly Subscription"}
            </button>
          </form>
        )}
      </Modal>
    </>
  );
}
