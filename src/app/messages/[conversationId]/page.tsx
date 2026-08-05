"use client";

import { use, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ImagePlus, Loader2, Send, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useConversationMessages,
  useSendMessage,
  useMarkRead,
} from "@/lib/hooks/useMessages";
import { useRealtimeConversation } from "@/lib/hooks/useSocket";
import { useAuthStore } from "@/stores";
import { Button } from "@/components/ui/button";
import { EmojiPicker } from "@/components/messages/EmojiPicker";
import { VoiceRecorder } from "@/components/messages/VoiceRecorder";
import { AudioPlayer } from "@/components/messages/AudioPlayer";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { resolveMediaUrl } from "@/lib/utils/mediaUrl";
import { getOtherParticipantId } from "@/lib/utils/conversationId";
import {
  getMessageParticipantId,
  resolveOtherParticipantId,
  resolveOtherParticipantProfile,
} from "@/lib/utils/messageParticipants";
import type { Message } from "@/lib/api/messages";

function formatTime(dateStr?: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isLikelyImageUrl(url: string): boolean {
  const lower = url.toLowerCase();
  return (
    lower.includes("/image/upload/") ||
    /\.(jpe?g|png|gif|webp|avif|bmp)(\?|$)/i.test(lower)
  );
}

function MessageBubble({
  msg,
  isMe,
}: {
  msg: Message;
  isMe: boolean;
}) {
  const [imgBroken, setImgBroken] = useState(false);

  const rawAttachment = msg.pieceJointe?.trim() || null;
  const isImageType =
    msg.typePieceJointe === "IMAGE" ||
    (!msg.typePieceJointe && !!rawAttachment && isLikelyImageUrl(rawAttachment));

  const imageUrl =
    rawAttachment && isImageType && !imgBroken
      ? resolveMediaUrl(rawAttachment) ?? rawAttachment
      : null;

  const audioUrl =
    rawAttachment && msg.typePieceJointe === "AUDIO" ? rawAttachment : null;

  const hasMedia = !!imageUrl || !!audioUrl;
  const showText =
    msg.contenu &&
    msg.contenu !== "📷 Photo" &&
    msg.contenu !== "🎤 Message vocal";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className={cn("flex", isMe ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[75%] overflow-hidden rounded-2xl text-sm",
          isMe
            ? "rounded-tr-sm bg-primary-600 text-white"
            : "rounded-tl-sm bg-white text-neutral-900 shadow-sm",
          imageUrl ? "p-1" : audioUrl ? "px-3 py-2" : "px-4 py-2.5",
        )}
      >
        {imageUrl && (
          <a href={imageUrl} target="_blank" rel="noopener noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Photo du problème"
              className="block max-h-64 w-48 rounded-xl object-cover sm:w-56"
              onError={() => setImgBroken(true)}
            />
          </a>
        )}
        {rawAttachment && isImageType && imgBroken && (
          <p className={cn("px-3 py-2 text-xs", isMe ? "text-white/80" : "text-neutral-500")}>
            📷 Photo (aperçu indisponible)
          </p>
        )}
        {audioUrl && (
          <AudioPlayer
            src={audioUrl}
            isMe={isMe}
            durationHint={msg.dureeFichier}
          />
        )}
        {showText && (
          <p className={cn("leading-relaxed", hasMedia && "px-3 py-2")}>
            {msg.contenu}
          </p>
        )}
        <p
          className={cn(
            "text-right text-[10px]",
            imageUrl ? "px-3 pb-2" : "",
            isMe ? "text-white/60" : "text-neutral-400",
          )}
        >
          {formatTime(msg.createdAt)}
          {isMe && (
            <span className="ml-1">{msg.statut === "LU" ? "✓✓" : "✓"}</span>
          )}
        </p>
      </div>
    </motion.div>
  );
}

export default function ConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = use(params);
  const utilisateur = useAuthStore((s) => s.utilisateur);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [inputText, setInputText] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);
  const [realtimeMessages, setRealtimeMessages] = useState<Message[]>([]);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const { data: historicMessages = [], isLoading } =
    useConversationMessages(conversationId);
  const { mutateAsync: sendHttp, isPending: sending } =
    useSendMessage(conversationId);
  const { mutate: markRead } = useMarkRead(conversationId);

  const handleNewMessage = useCallback((msg: Message) => {
    setRealtimeMessages((prev) => {
      if (prev.some((m) => m._id === msg._id)) return prev;
      return [...prev, msg];
    });
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const { partnerTyping, emitTypingStart, emitTypingStop } =
    useRealtimeConversation(conversationId, handleNewMessage);

  const allMessages = [
    ...historicMessages,
    ...realtimeMessages.filter(
      (rm) => !historicMessages.some((hm) => hm._id === rm._id),
    ),
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages.length]);

  useEffect(() => {
    if (utilisateur?._id) markRead();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, utilisateur?._id]);

  useEffect(() => {
    return () => {
      if (attachmentPreview) URL.revokeObjectURL(attachmentPreview);
    };
  }, [attachmentPreview]);

  const currentUserId = utilisateur?._id ?? "";
  const otherParticipant = resolveOtherParticipantProfile(allMessages, currentUserId);
  const otherUserId = resolveOtherParticipantId(
    allMessages,
    currentUserId,
    conversationId,
  );

  const otherName = (() => {
    if (!otherParticipant) return "Conversation";
    const name = `${otherParticipant.prenom ?? ""} ${otherParticipant.nom ?? ""}`.trim();
    return name || "Conversation";
  })();

  const getDestinataireId = (): string =>
    otherUserId ?? getOtherParticipantId(conversationId, currentUserId) ?? "";

  const clearAttachment = () => {
    if (attachmentPreview) URL.revokeObjectURL(attachmentPreview);
    setAttachment(null);
    setAttachmentPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Seules les images sont acceptées pour le moment.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image trop volumineuse (max 5 Mo).");
      return;
    }
    if (attachmentPreview) URL.revokeObjectURL(attachmentPreview);
    setAttachment(file);
    setAttachmentPreview(URL.createObjectURL(file));
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputText.trim();
    if ((!text && !attachment) || !utilisateur) return;

    const destinataireId = getDestinataireId();
    if (!destinataireId) {
      toast.error("Destinataire introuvable.");
      return;
    }

    const savedText = text;
    const savedFile = attachment;
    setInputText("");
    clearAttachment();
    emitTypingStop();

    const payload = {
      expediteur: utilisateur._id,
      destinataire: destinataireId,
      contenu: savedText || "📷 Photo",
      conversationId,
    };

    try {
      if (savedFile) {
        const { sendMessageWithAttachment } = await import("@/lib/api/messages");
        const sent = await sendMessageWithAttachment({
          expediteur: utilisateur._id,
          destinataire: destinataireId,
          contenu: savedText || undefined,
          file: savedFile,
        });
        handleNewMessage(sent);
      } else {
        await sendHttp(payload);
      }
    } catch {
      toast.error("Message non envoyé. Réessayez.");
      setInputText(savedText);
    }
  };

  const handleVoiceSend = useCallback(async (blob: Blob, durationSeconds: number) => {
    if (!utilisateur) return;
    const destinataireId = getDestinataireId();
    if (!destinataireId) {
      toast.error("Destinataire introuvable.");
      return;
    }
    try {
      const ext = blob.type.includes("ogg") ? "ogg" : "webm";
      const audioFile = new File([blob], `vocal.${ext}`, { type: blob.type });
      const { sendMessageWithAttachment } = await import("@/lib/api/messages");
      const sent = await sendMessageWithAttachment({
        expediteur: utilisateur._id,
        destinataire: destinataireId,
        file: audioFile,
        dureeFichier: durationSeconds,
      });
      handleNewMessage(sent);
    } catch {
      toast.error("Vocal non envoyé. Réessayez.");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [utilisateur]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;

    emitTypingStart();
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(emitTypingStop, 2000);
  };

  const insertEmoji = (emoji: string) => {
    setInputText((prev) => prev + emoji);
  };

  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col bg-neutral-50">
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
          {partnerTyping ? (
            <p className="text-xs text-primary-500 animate-pulse">
              En train d&apos;écrire…
            </p>
          ) : (
            <p className="text-xs text-neutral-400">En ligne</p>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
          </div>
        ) : allMessages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <p className="text-sm text-neutral-500">
              Démarrez la conversation en envoyant un message.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {allMessages.map((msg) => {
                const expId = getMessageParticipantId(msg.expediteur);
                const isMe = expId === utilisateur?._id;
                return <MessageBubble key={msg._id} msg={msg} isMe={!!isMe} />;
              })}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {attachmentPreview && (
        <div className="border-t border-neutral-200 bg-neutral-50 px-4 py-2">
          <div className="relative inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={attachmentPreview}
              alt="Aperçu"
              className="h-20 w-20 rounded-xl object-cover"
            />
            <button
              type="button"
              onClick={clearAttachment}
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-white"
              aria-label="Supprimer la pièce jointe"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSend}
        className="flex items-end gap-1 border-t border-neutral-200 bg-white px-3 py-3 sm:gap-2 sm:px-4"
      >
        <EmojiPicker onSelect={insertEmoji} />
        <label htmlFor="message-attachment" className="sr-only">
          Joindre une photo du problème
        </label>
        <input
          id="message-attachment"
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
          aria-label="Joindre une photo"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
          aria-label="Envoyer une photo du problème"
          title="Photo du problème"
        >
          <ImagePlus className="h-5 w-5" />
        </button>
        <VoiceRecorder onSend={handleVoiceSend} disabled={sending} />
        <textarea
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend(e as unknown as React.FormEvent);
            }
          }}
          placeholder="Message (optionnel si photo ou vocal)"
          rows={1}
          className="max-h-32 min-h-10 flex-1 resize-none rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        />
        <Button
          type="submit"
          size="sm"
          disabled={(!inputText.trim() && !attachment) || sending}
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
