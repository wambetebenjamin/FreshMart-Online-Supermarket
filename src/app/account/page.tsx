"use client";

import { useState } from "react";
import Link from "next/link";
import { Gift, Heart, LogIn, Search, Truck, User } from "lucide-react";
import { loyaltyTiers } from "@/lib/data";
import { WHATSAPP_HELP_URL } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/BrandIcons";

export default function AccountPage() {
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "found" | "missing" | "error">("idle");
  const [member, setMember] = useState<{ memberId: string; name: string; points: number } | null>(null);

  const lookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch(`/api/loyalty?phone=${encodeURIComponent(phone)}`);
      if (res.status === 404) {
        setStatus("missing");
        return;
      }
      const json = await res.json();
      setMember(json);
      setStatus("found");
    } catch {
      setStatus("error");
    }
  };

  const nextTier = loyaltyTiers.find((t) => member && member.points < t.points);

  return (
    <section className="section">
      <div className="fm-container" style={{ maxWidth: 720 }}>
        <div className="section-head">
          <span className="section-eyebrow">
            <User size={14} /> My Account
          </span>
          <h1 className="section-title" style={{ fontSize: 26 }}>
            Your FreshMart, at a glance.
          </h1>
        </div>

        <div className="fm-card">
          <h2 style={{ fontSize: 17, display: "flex", alignItems: "center", gap: 8 }}>
            <Gift size={17} style={{ color: "var(--fm-brand)" }} /> FreshPoints balance
          </h2>
          <p style={{ fontSize: 14, color: "var(--fm-muted)" }}>
            Enter the phone number you signed up with to check your points.
          </p>
          <form onSubmit={lookup} className="fm-newsletter" style={{ maxWidth: 420 }}>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="07XX XXX XXX"
              aria-label="Phone number"
            />
            <button type="submit" disabled={status === "loading"}>
              {status === "loading" ? "…" : <Search size={14} />}
            </button>
          </form>

          {status === "missing" && (
            <p style={{ fontSize: 14, marginTop: 12 }}>
              No FreshPoints account found for that number.{" "}
              <Link href="/#loyalty">Join FreshPoints</Link> and collect 100 welcome points.
            </p>
          )}
          {status === "error" && (
            <p style={{ fontSize: 14, marginTop: 12, color: "var(--fm-black)", fontWeight: 600 }}>
              Could not check right now — please try again.
            </p>
          )}
          {status === "found" && member && (
            <div style={{ marginTop: 16, borderLeft: "4px solid var(--fm-brand)", padding: "12px 16px", background: "var(--fm-bg-soft)" }}>
              <strong style={{ fontFamily: "var(--fm-font-head)", fontSize: 15 }}>
                {member.name} · {member.memberId}
              </strong>
              <div style={{ fontSize: 30, fontFamily: "var(--fm-font-head)", fontWeight: 800, color: "var(--fm-brand)" }}>
                {member.points.toLocaleString("en-US")} <span style={{ fontSize: 14, color: "var(--fm-muted)", fontWeight: 600 }}>points</span>
              </div>
              {nextTier ? (
                <p style={{ fontSize: 13, margin: 0, color: "var(--fm-muted)" }}>
                  {(nextTier.points - member.points).toLocaleString("en-US")} more points to unlock:{" "}
                  {nextTier.reward}
                </p>
              ) : (
                <p style={{ fontSize: 13, margin: 0, color: "var(--fm-muted)" }}>
                  You’ve unlocked our top reward. Asante!
                </p>
              )}
            </div>
          )}
        </div>

        <div className="fm-card" style={{ marginTop: 20 }}>
          <h2 style={{ fontSize: 17, display: "flex", alignItems: "center", gap: 8 }}>
            <Truck size={17} style={{ color: "var(--fm-brand)" }} /> Track an order
          </h2>
          <p style={{ fontSize: 14, color: "var(--fm-muted)" }}>
            Send us your order number on WhatsApp and we’ll reply with live rider status.
          </p>
          <a className="btn btn-brand btn-sm" href={WHATSAPP_HELP_URL} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon size={14} /> WhatsApp Us
          </a>
        </div>

        <div className="fm-card" style={{ marginTop: 20 }}>
          <h2 style={{ fontSize: 17, display: "flex", alignItems: "center", gap: 8 }}>
            <Heart size={17} style={{ color: "var(--fm-brand)" }} /> Wishlist
          </h2>
          <p style={{ fontSize: 14, color: "var(--fm-muted)" }}>Everything you’ve saved for later.</p>
          <Link href="/wishlist" className="btn btn-outline btn-sm">
            <LogIn size={14} /> Open Wishlist
          </Link>
        </div>
      </div>
    </section>
  );
}
