import Link from "next/link";
import { PackageOpen } from "lucide-react";

export default function NotFound() {
  return (
    <section className="section">
      <div className="fm-container fm-empty-state">
        <PackageOpen />
        <h1 style={{ fontSize: 26 }}>This aisle is empty.</h1>
        <p>The page you’re looking for has moved or never existed.</p>
        <Link href="/" className="btn btn-brand" style={{ marginTop: 18 }}>
          Back to FreshMart
        </Link>
      </div>
    </section>
  );
}
