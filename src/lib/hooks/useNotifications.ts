"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchNotifications,
  fetchUnreadCount,
  markAsRead,
  markAllAsRead,
} from "@/lib/api/notifications";
import { useAuthStore } from "@/stores";

export function useNotifications(params?: {
  limit?: number;
  offset?: number;
  statut?: string;
}) {
  const utilisateur = useAuthStore((s) => s.utilisateur);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ["notifications", utilisateur?._id, params?.limit, params?.offset, params?.statut],
    queryFn: () => fetchNotifications(utilisateur!._id, params),
    enabled: isAuthenticated && !!utilisateur?._id,
    staleTime: 60_000,
    refetchInterval: 120_000,
  });
}

export function useUnreadCount() {
  const utilisateur = useAuthStore((s) => s.utilisateur);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ["notifications-count", utilisateur?._id],
    queryFn: () => fetchUnreadCount(utilisateur!._id),
    enabled: isAuthenticated && !!utilisateur?._id,
    staleTime: 45_000,
    refetchInterval: 90_000,
  });
}

export function useMarkAllRead() {
  const queryClient = useQueryClient();
  const utilisateur = useAuthStore((s) => s.utilisateur);

  return useMutation({
    mutationFn: () => markAllAsRead(utilisateur!._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-count"] });
    },
  });
}

export function useMarkRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-count"] });
    },
  });
}
