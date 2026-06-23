"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchConversations,
  fetchConversationMessages,
  sendMessage,
  markConversationRead,
} from "@/lib/api/messages";
import { useAuthStore } from "@/stores";

export function useConversations() {
  const utilisateur = useAuthStore((s) => s.utilisateur);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ["conversations", utilisateur?._id],
    queryFn: () => fetchConversations(utilisateur!._id),
    enabled: isAuthenticated && !!utilisateur?._id,
    staleTime: 30_000,
    refetchInterval: 30_000,
  });
}

export function useConversationMessages(conversationId: string) {
  const utilisateur = useAuthStore((s) => s.utilisateur);

  return useQuery({
    queryKey: ["conversation-messages", conversationId],
    queryFn: () =>
      fetchConversationMessages(conversationId, utilisateur!._id),
    enabled: !!conversationId && !!utilisateur?._id,
    staleTime: 5_000,
    refetchInterval: 8_000, // Polling léger
  });
}

export function useSendMessage(conversationId?: string) {
  const queryClient = useQueryClient();
  const utilisateur = useAuthStore((s) => s.utilisateur);

  return useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      if (conversationId) {
        queryClient.invalidateQueries({
          queryKey: ["conversation-messages", conversationId],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useMarkRead(conversationId: string) {
  const queryClient = useQueryClient();
  const utilisateur = useAuthStore((s) => s.utilisateur);

  return useMutation({
    mutationFn: () =>
      markConversationRead(conversationId, utilisateur!._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}
