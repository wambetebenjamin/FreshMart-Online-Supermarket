import Link from "next/link";

/** FreshMart logo — vector leaf mark in the design-source brand green. */
export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="fm-logo" aria-label="FreshMart home">
      <span className="fm-logo-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
      </span>
      {!compact && (
        <span>
          Fresh<em>Mart</em>
        </span>
      )}
    </Link>
  );
}
