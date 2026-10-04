import { WhatsAppIcon } from "./BrandIcons";
import { WHATSAPP_HELP_URL } from "@/lib/utils";

/**
 * Floating WhatsApp help button, bottom-right.
 * Subtle scale pulse every 8 seconds (CSS, disabled under reduced motion).
 */
export default function WhatsAppFloat() {
  return (
    <div className="fm-whatsapp-float">
      <span className="fm-whatsapp-tip">Order help or track your delivery</span>
      <a
        className="fm-whatsapp-btn"
        href={WHATSAPP_HELP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with FreshMart on WhatsApp — order help or track your delivery"
      >
        <WhatsAppIcon size={26} />
      </a>
    </div>
  );
}
