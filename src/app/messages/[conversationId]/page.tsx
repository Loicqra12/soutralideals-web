"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useConversationMessages,
  useSendMessage,
  useMarkRead,
} from "@/lib/hooks/useMessages";
import { useAuthStore } from "@/stores";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function formatTime(dateStr?: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = use(params);
  const utilisateur = useAuthStore((s) => s.utilisateur);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [inputText, setInputText] = useState("");

  const { data: messages = [], isLoading } = useConversationMessages(conversationId);
  const { mutateAsync: send, isPending: sending } = useSendMessage(conversationId);
  const { mutate: markRead } = useMarkRead(conversationId);

  // Scroll en bas à chaque nouveau message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // Marquer comme lu à l'ouverture
  useEffect(() => {
    if (utilisateur?._id) markRead();
  }, [conversationId, utilisateur?._id]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text || !utilisateur) return;

    // Trouver le destinataire (l'autre personne)
    const otherMsg = messages.find(
      (m) =>
        (typeof m.expediteur === "object" ? m.expediteur._id : m.expediteur) !==
        utilisateur._id,
    );
    const destinataireId =
      typeof otherMsg?.expediteur === "object"
        ? otherMsg.expediteur._id
        : otherMsg?.destinataire
          ? typeof otherMsg.destinataire === "object"
            ? otherMsg.destinataire._id
            : otherMsg.destinataire
          : "";

    if (!destinataireId) {
      toast.error("Destinataire introuvable.");
      return;
    }

    setInputText("");
    try {
      await send({
        expediteur: utilisateur._id,
        destinataire: destinataireId,
        contenu: text,
      });
    } catch {
      toast.error("Message non envoyé. Réessayez.");
      setInputText(text);
    }
  };

  const otherUser = messages.find((m) => {
    const expId =
      typeof m.expediteur === "object" ? m.expediteur._id : m.expediteur;
    return expId !== utilisateur?._id;
  })?.expediteur;

  const otherName =
    typeof otherUser === "object"
      ? `${otherUser?.prenom ?? ""} ${otherUser?.nom ?? ""}`.trim() ||
        "Conversation"
      : "Conversation";

  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col bg-neutral-50 md:h-[calc(100dvh-4rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-neutral-200 bg-white px-4 py-3">
        <Button variant="ghost" size="sm" asChild className="-ml-2 shrink-0">
          <Link href="/messages">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
          {otherName.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-semibold text-neutral-900">{otherName}</p>
          <p className="text-xs text-neutral-400">En ligne</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <p className="text-sm text-neutral-500">
              Démarrez la conversation en envoyant un message.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {messages.map((msg) => {
                const expId =
                  typeof msg.expediteur === "object"
                    ? msg.expediteur._id
                    : msg.expediteur;
                const isMe = expId === utilisateur?._id;

                return (
                  <motion.div
                    key={msg._id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                    className={cn(
                      "flex",
                      isMe ? "justify-end" : "justify-start",
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm",
                        isMe
                          ? "rounded-tr-sm bg-primary-600 text-white"
                          : "rounded-tl-sm bg-white text-neutral-900 shadow-sm",
                      )}
                    >
                      <p className="leading-relaxed">{msg.contenu}</p>
                      <p
                        className={cn(
                          "mt-1 text-right text-[10px]",
                          isMe ? "text-white/60" : "text-neutral-400",
                        )}
                      >
                        {formatTime(msg.createdAt)}
                        {isMe && (
                          <span className="ml-1">
                            {msg.statut === "LU" ? "✓✓" : "✓"}
                          </span>
                        )}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="flex items-end gap-2 border-t border-neutral-200 bg-white px-4 py-3"
      >
        <textarea
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend(e as unknown as React.FormEvent);
            }
          }}
          placeholder="Écrivez un message…"
          rows={1}
          className="max-h-32 min-h-[2.5rem] flex-1 resize-none rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        />
        <Button
          type="submit"
          size="sm"
          disabled={!inputText.trim() || sending}
          className="h-10 w-10 shrink-0 rounded-xl p-0"
        >
          {sending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
}
