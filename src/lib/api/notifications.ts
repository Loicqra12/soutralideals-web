import apiClient from "./client";

export interface Notification {
  _id: string;
  type: string;
  titre: string;
  contenu: string;
  statut: "NON_LUE" | "LUE" | "ARCHIVEE";
  priorite?: string;
  createdAt?: string;
  donnees?: Record<string, unknown>;
}

export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  limit: number;
  offset: number;
}

export async function fetchNotifications(
  userId: string,
  params?: { limit?: number; offset?: number; statut?: string },
): Promise<NotificationsResponse> {
  const { data } = await apiClient.get<NotificationsResponse>(
    `/notification/user/${userId}`,
    { params: { limit: params?.limit ?? 20, offset: params?.offset ?? 0, statut: params?.statut } },
  );
  return {
    notifications: data.notifications ?? [],
    total: data.total ?? 0,
    limit: data.limit ?? 20,
    offset: data.offset ?? 0,
  };
}

export async function fetchUnreadCount(userId: string): Promise<number> {
  const { data } = await apiClient.get<{ count: number }>(
    `/notification/user/${userId}/unread-count`,
  );
  return data.count ?? 0;
}

export async function markAsRead(notificationId: string): Promise<void> {
  await apiClient.put(`/notification/${notificationId}/read`);
}

export async function markAllAsRead(userId: string): Promise<void> {
  await apiClient.put(`/notification/user/${userId}/read-all`);
}
