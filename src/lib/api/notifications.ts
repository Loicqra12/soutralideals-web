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

export async function fetchNotifications(userId: string): Promise<Notification[]> {
  const { data } = await apiClient.get<Notification[]>(
    `/notification/user/${userId}`,
    { params: { statut: undefined, limit: 20 } },
  );
  return Array.isArray(data) ? data : [];
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
