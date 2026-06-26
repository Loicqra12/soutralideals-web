"use client";

import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { useAuthStore } from "@/stores";
import type { Message } from "@/lib/api/messages";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ??
  "http://localhost:3000";

let socketInstance: Socket | null = null;

function getSocket(): Socket {
  if (!socketInstance || !socketInstance.connected) {
    socketInstance = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }
  return socketInstance;
}

/**
 * Hook Socket.io global — authentifie l'utilisateur dès la connexion.
 * À monter une seule fois dans le layout principal.
 */
export function useSocketAuth() {
  const utilisateur = useAuthStore((s) => s.utilisateur);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated || !utilisateur?._id) return;

    const socket = getSocket();
    if (!socket.connected) {
      socket.connect();
    }

    socket.on("connect", () => {
      socket.emit("authenticate", utilisateur._id);
    });

    if (socket.connected) {
      socket.emit("authenticate", utilisateur._id);
    }

    return () => {
      socket.off("connect");
    };
  }, [isAuthenticated, utilisateur?._id]);
}

/**
 * Hook pour une conversation spécifique.
 * Gère les messages temps réel + indicateur de saisie.
 */
export function useRealtimeConversation(
  conversationId: string,
  onNewMessage: (msg: Message) => void,
) {
  const utilisateur = useAuthStore((s) => s.utilisateur);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!conversationId) return;

    const socket = getSocket();

    socket.emit("join-conversation", conversationId);

    socket.on("new-message", (msg: Message) => {
      const senderId =
        typeof msg.expediteur === "object" ? msg.expediteur._id : msg.expediteur;
      if (senderId !== utilisateur?._id) {
        onNewMessage(msg);
      }
    });

    socket.on("typing-start", (data: { conversationId: string; userId: string }) => {
      if (
        data.conversationId === conversationId &&
        data.userId !== utilisateur?._id
      ) {
        setPartnerTyping(true);
        clearTimeout(typingTimer.current);
        typingTimer.current = setTimeout(() => setPartnerTyping(false), 3000);
      }
    });

    socket.on("typing-stop", (data: { conversationId: string }) => {
      if (data.conversationId === conversationId) {
        clearTimeout(typingTimer.current);
        setPartnerTyping(false);
      }
    });

    return () => {
      socket.emit("leave-conversation", conversationId);
      socket.off("new-message");
      socket.off("typing-start");
      socket.off("typing-stop");
      clearTimeout(typingTimer.current);
    };
  }, [conversationId, utilisateur?._id, onNewMessage]);

  const emitTypingStart = () => {
    const socket = getSocket();
    socket.emit("typing-start", { conversationId, userId: utilisateur?._id });
  };

  const emitTypingStop = () => {
    const socket = getSocket();
    socket.emit("typing-stop", { conversationId, userId: utilisateur?._id });
  };

  const sendViaSocket = (payload: {
    expediteur: string;
    destinataire: string;
    contenu: string;
    conversationId: string;
  }) => {
    const socket = getSocket();
    socket.emit("send-message", payload);
  };

  return { partnerTyping, emitTypingStart, emitTypingStop, sendViaSocket };
}
