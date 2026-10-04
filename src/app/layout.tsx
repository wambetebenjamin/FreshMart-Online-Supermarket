import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import ToastHost from "@/components/Toast";
import RegisterSW from "@/components/RegisterSW";
import { SITE } from "@/lib/utils";

/* Self-hosted fonts from the design source (Dosis body, Poppins headings) */
const dosis = localFont({
  src: [
    { path: "../fonts/dosis-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/dosis-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/dosis-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../fonts/dosis-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-dosis",
  display: "swap",
});

const poppins = localFont({
  src: [
    { path: "../fonts/poppins-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/poppins-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/poppins-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../fonts/poppins-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "../fonts/poppins-latin-800-normal.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "FreshMart — Nairobi's Online Supermarket | Fresh. Fast. Delivered.",
    template: "%s | FreshMart Kenya",
  },
  description: SITE.description,
  keywords: [
    "online supermarket Nairobi",
    "grocery delivery Kenya",
    "fresh produce delivery Nairobi",
    "M-Pesa grocery shopping",
    "weekly veggie box Kenya",
  ],
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/favicon.ico" }],
    apple: [{ url: "/icons/apple-touch-icon.png" }],
  },
  openGraph: {
    type: "website",
    siteName: "FreshMart",
    title: "FreshMart — Nairobi's Online Supermarket",
    description: SITE.description,
    url: SITE.url,
    images: [{ url: "/images/hero-nairobi-market.jpg", width: 1000, height: 666, alt: "Fresh produce at a Nairobi market" }],
    locale: "en_KE",
  },
  twitter: {
    card: "summary_large_image",
    title: "FreshMart — Nairobi's Online Supermarket",
    description: SITE.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#b0b435",
  width: "device-width",
  initialScale: 1,
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.legalName,
  url: SITE.url,
  logo: `${SITE.url}/icons/icon-512.png`,
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+254112272061",
    contactType: "customer service",
    areaServed: "Nairobi, Kenya",
    availableLanguage: ["English", "Kiswahili"],
  },
  sameAs: [],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "FreshMart",
  url: SITE.url,
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${SITE.url}/search?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dosis.variable} ${poppins.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([orgJsonLd, websiteJsonLd]) }}
        />
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
        <CartDrawer />
        <WhatsAppFloat />
        <ToastHost />
        <RegisterSW />
      </body>
    </html>
  );
}
