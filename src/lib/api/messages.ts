import apiClient from "./client";
import { postMultipart } from "./multipart";

export interface MessageUser {
  _id: string;
  nom?: string;
  prenom?: string;
  photoProfil?: string;
}

export interface Message {
  _id: string;
  expediteur: MessageUser;
  destinataire: MessageUser;
  contenu: string;
  statut: "ENVOYE" | "DELIVRE" | "LU";
  typeMessage?: string;
  pieceJointe?: string;
  typePieceJointe?: string;
  conversationId: string;
  createdAt?: string;
}

export interface Conversation {
  conversationId: string;
  interlocuteur: MessageUser;
  dernierMessage: Message;
  nonLus: number;
}

export async function fetchConversations(userId: string): Promise<Conversation[]> {
  const { data } = await apiClient.get<{ conversations: Conversation[] }>(
    `/messages/conversations/${userId}`,
  );
  return data.conversations ?? [];
}

export async function fetchConversationMessages(
  conversationId: string,
  userId: string,
): Promise<Message[]> {
  const { data } = await apiClient.get<{ messages: Message[] }>(
    `/messages/conversation/${conversationId}`,
    { params: { userId } },
  );
  return data.messages ?? [];
}

export async function sendMessage(payload: {
  expediteur: string;
  destinataire: string;
  contenu: string;
  typeMessage?: string;
  referenceId?: string;
  referenceType?: string;
}): Promise<Message> {
  const { data } = await apiClient.post<Message>("/message", payload);
  return data;
}

export async function sendMessageWithAttachment(payload: {
  expediteur: string;
  destinataire: string;
  contenu: string;
  file: File;
  typeMessage?: string;
}): Promise<Message> {
  const formData = new FormData();
  formData.append("expediteur", payload.expediteur);
  formData.append("destinataire", payload.destinataire);
  formData.append("contenu", payload.contenu || "📷 Photo");
  formData.append("pieceJointe", payload.file);
  if (payload.typeMessage) formData.append("typeMessage", payload.typeMessage);
  return postMultipart<Message>("message", formData);
}

export async function markConversationRead(
  conversationId: string,
  userId: string,
): Promise<void> {
  await apiClient.patch("/messages/mark-read", { conversationId, userId });
}

export async function fetchUnreadMessages(userId: string): Promise<Message[]> {
  const { data } = await apiClient.get<{ messages: Message[] }>(
    `/messages/unread/${userId}`,
  );
  return data.messages ?? [];
}
