"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CircleCheck, ShoppingBag, X } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { blurFor } from "@/lib/blur-map";

export interface ToastPayload {
  message: string;
  image?: string;
  actionLabel?: string;
  onAction?: () => void;
  type?: "success" | "info" | "brand";
}

export function toast(payload: string | ToastPayload) {
  if (typeof window === "undefined") return;
  const detail = typeof payload === "string" ? { message: payload } : payload;
  window.dispatchEvent(new CustomEvent("fm-toast", { detail }));
}

/** Global toast with progress timer, image preview, and quick actions. */
export default function ToastHost() {
  const [data, setData] = useState<ToastPayload | null>(null);
  const openDrawer = useCartStore((s) => s.openDrawer);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<ToastPayload>).detail;
      setData(detail);
      clearTimeout(timer);
      timer = setTimeout(() => setData(null), 3200);
    };
    window.addEventListener("fm-toast", handler);
    return () => {
      window.removeEventListener("fm-toast", handler);
      clearTimeout(timer);
    };
  }, []);

  if (!data) return null;

  const isCartNotice = data.message.toLowerCase().includes("basket") || data.message.toLowerCase().includes("cart");

  return (
    <aside
      className="fm-toast is-visible"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="fm-toast-content">
        {data.image ? (
          <div className="fm-toast-thumb">
            <Image
              src={data.image}
              alt=""
              width={38}
              height={38}
              placeholder="blur"
              blurDataURL={blurFor(data.image)}
            />
          </div>
        ) : (
          <CircleCheck className="fm-toast-icon" aria-hidden="true" />
        )}
        <div className="fm-toast-text">
          <p className="fm-toast-msg">{data.message}</p>
        </div>
        {isCartNotice && (
          <button
            type="button"
            className="fm-toast-btn"
            onClick={() => {
              setData(null);
              openDrawer();
            }}
          >
            <ShoppingBag size={13} /> View Basket
          </button>
        )}
        <button
          type="button"
          className="fm-toast-close"
          aria-label="Dismiss notice"
          onClick={() => setData(null)}
        >
          <X size={15} />
        </button>
      </div>
      <div className="fm-toast-bar" aria-hidden="true" />
    </aside>
  );
}
