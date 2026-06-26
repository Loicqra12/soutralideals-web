"use client";

import { Phone, MessageSquare, Calendar, MessageCircle } from "lucide-react";
import { StartConversationButton } from "./StartConversationButton";

interface MobileCtaBarProps {
  phoneLink?: string | null;
  waLink?: string | null;
  destinataireUserId?: string;
  onDevis?: () => void;
  variant?: "prestataire" | "freelance";
}

/**
 * Barre d'action fixe en bas de page sur mobile.
 * Visible uniquement sur mobile (md:hidden).
 */
export function MobileCtaBar({
  phoneLink,
  waLink,
  destinataireUserId,
  onDevis,
  variant = "prestataire",
}: MobileCtaBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-16 z-30 border-t border-neutral-200 bg-white/95 px-4 py-3 backdrop-blur md:hidden">
      <div className="flex gap-2">
        {/* Message in-app */}
        <StartConversationButton
          destinataireUserId={destinataireUserId}
          label="Message"
          size="default"
          variant="outline"
          className="flex-1"
        />

        {/* WhatsApp */}
        {waLink && (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-3 py-2.5 text-sm font-medium text-white"
            aria-label="WhatsApp"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
        )}

        {/* Appel ou devis */}
        {phoneLink ? (
          <a
            href={phoneLink}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-neutral-900 px-3 py-2.5 text-sm font-medium text-white"
            aria-label="Appeler"
          >
            <Phone className="h-4 w-4" />
            Appeler
          </a>
        ) : variant === "prestataire" && onDevis ? (
          <button
            onClick={onDevis}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-600 px-3 py-2.5 text-sm font-medium text-white"
          >
            <Calendar className="h-4 w-4" />
            Devis
          </button>
        ) : null}
      </div>
    </div>
  );
}
