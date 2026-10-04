"use client";

import { useState } from "react";
import { Gift } from "lucide-react";
import Modal from "./Modal";
import { loyaltyTiers } from "@/lib/data";

/** FreshPoints — earn 1 point per KES 100 spent. */
export default function LoyaltySection() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [member, setMember] = useState<{ memberId: string; points: number } | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/loyalty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      const json = await res.json();
      setMember(json);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <div className="fm-loyalty">
        <div>
          <span className="section-eyebrow">
            <Gift size={14} /> FreshPoints
          </span>
          <h2 className="section-title" style={{ textAlign: "left" }}>
            Every KES 100 earns a point.
          </h2>
          <p>
            FreshPoints is our way of saying asante for shopping with us. Earn 1 point for every
            KES 100 you spend — on groceries, bundles, everything. Points never expire, and
            redeeming them takes one tap at checkout.
          </p>
          <ul style={{ margin: "0 0 24px", paddingLeft: 20, fontSize: 15 }}>
            <li>1 point per KES 100 spent — deals included</li>
            <li>Redeem from just 500 points</li>
            <li>Bonus 100 welcome points when you join today</li>
          </ul>
          <button type="button" className="btn btn-brand" onClick={() => setOpen(true)}>
            Join FreshPoints
          </button>
        </div>

        <div>
          <div className="fm-points-card" style={{ marginBottom: 22 }}>
            <span className="fm-points-num">100</span>
            <p>welcome points the moment you join — that’s already KES 50 towards your next order.</p>
          </div>
          <table className="fm-points-table">
            <thead>
              <tr>
                <th scope="col">Points</th>
                <th scope="col">Reward</th>
              </tr>
            </thead>
            <tbody>
              {loyaltyTiers.map((tier) => (
                <tr key={tier.points}>
                  <td>{tier.points.toLocaleString("en-US")} pts</td>
                  <td>{tier.reward}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Join FreshPoints">
        {status === "done" && member ? (
          <div style={{ textAlign: "center", padding: "12px 4px" }}>
            <Gift size={44} style={{ color: "var(--fm-brand)", margin: "0 auto 14px", display: "block" }} />
            <h3 style={{ marginBottom: 8 }}>Karibu, {form.name.split(" ")[0]}!</h3>
            <p style={{ fontSize: 14 }}>
              Your FreshPoints account is live.
              <br />
              Member ID: <strong>{member.memberId}</strong> · Balance:{" "}
              <strong>{member.points} points</strong>
            </p>
            <p style={{ fontSize: 13, color: "var(--fm-muted)" }}>
              Check your balance any time under My Account.
            </p>
            <button type="button" className="btn btn-brand btn-block" style={{ marginTop: 12 }} onClick={() => setOpen(false)}>
              Asante! Done
            </button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="fm-field">
              <label htmlFor="lp-name">Full name</label>
              <input
                id="lp-name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Otieno Odhiambo"
              />
            </div>
            <div className="fm-field">
              <label htmlFor="lp-phone">Phone number</label>
              <input
                id="lp-phone"
                required
                inputMode="tel"
                pattern="[0-9+ ]{9,15}"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="07XX XXX XXX"
              />
            </div>
            <div className="fm-field">
              <label htmlFor="lp-email">Email (optional)</label>
              <input
                id="lp-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
              />
            </div>
            {status === "error" && (
              <p className="fm-error" role="alert">
                Could not sign you up — please try again.
              </p>
            )}
            <button type="submit" className="btn btn-brand btn-block" disabled={status === "sending"}>
              {status === "sending" ? "Joining…" : "Join FreshPoints — Get 100 Points"}
            </button>
          </form>
        )}
      </Modal>
    </>
  );
}
