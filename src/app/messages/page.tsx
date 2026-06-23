"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useConversations } from "@/lib/hooks/useMessages";
import { useAuthStore } from "@/stores";
import { Button } from "@/components/ui/button";
import { AnimatedGrid, AnimatedItem } from "@/components/shared/AnimatedGrid";
import { fadeInUp } from "@/lib/animations";

function getInitials(u?: { nom?: string; prenom?: string }): string {
  if (!u) return "?";
  return `${u.prenom?.charAt(0) ?? ""}${u.nom?.charAt(0) ?? ""}`.toUpperCase() || "?";
}

function timeAgo(dateStr?: string): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "À l'instant";
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}j`;
}

export default function MessagesPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data: conversations = [], isLoading } = useConversations();

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <MessageCircle className="mx-auto h-14 w-14 text-neutral-200" />
        <p className="mt-4 text-lg font-semibold text-neutral-900">
          Connectez-vous pour voir vos messages
        </p>
        <Button className="mt-6" asChild>
          <Link href="/connexion?redirect=/messages">Se connecter</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-2xl px-4 py-8 lg:px-8">
        <h1 className="text-2xl font-bold text-neutral-900">Messages</h1>

        {isLoading && (
          <div className="mt-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-neutral-200" />
            ))}
          </div>
        )}

        {!isLoading && conversations.length === 0 && (
          <div className="mt-16 flex flex-col items-center text-center">
            <MessageCircle className="h-16 w-16 text-neutral-200" />
            <p className="mt-4 text-lg font-semibold text-neutral-900">
              Aucune conversation
            </p>
            <p className="mt-2 text-sm text-neutral-500">
              Vos échanges avec les prestataires et freelances apparaîtront ici.
            </p>
            <Button className="mt-6" asChild>
              <Link href="/prestataires">Trouver un prestataire</Link>
            </Button>
          </div>
        )}

        {!isLoading && conversations.length > 0 && (
          <AnimatedGrid className="mt-6 space-y-2">
            {conversations.map((conv) => {
              const other = conv.interlocuteur;
              const name =
                `${other?.prenom ?? ""} ${other?.nom ?? ""}`.trim() || "Utilisateur";
              const last = conv.dernierMessage?.contenu ?? "";
              const time = timeAgo(conv.dernierMessage?.createdAt);
              const unread = conv.nonLus ?? 0;

              return (
                <AnimatedItem key={conv.conversationId}>
                  <Link
                    href={`/messages/${conv.conversationId}`}
                    className="block"
                  >
                    <motion.div
                      initial="rest"
                      whileHover="hover"
                      animate="rest"
                      className="flex items-center gap-4 rounded-2xl border border-neutral-100 bg-white px-4 py-3.5 shadow-sm transition-shadow hover:shadow-md"
                    >
                      {/* Avatar */}
                      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                        {getInitials(other)}
                        {unread > 0 && (
                          <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                            {unread > 9 ? "9+" : unread}
                          </span>
                        )}
                      </div>

                      {/* Text */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`truncate text-sm font-semibold ${unread > 0 ? "text-neutral-900" : "text-neutral-700"}`}>
                            {name}
                          </p>
                          <span className="shrink-0 text-xs text-neutral-400">
                            {time}
                          </span>
                        </div>
                        <p className={`mt-0.5 truncate text-sm ${unread > 0 ? "font-medium text-neutral-800" : "text-neutral-500"}`}>
                          {last || "Démarrez la conversation"}
                        </p>
                      </div>
                    </motion.div>
                  </Link>
                </AnimatedItem>
              );
            })}
          </AnimatedGrid>
        )}
      </div>
    </div>
  );
}
