/**
 * Réplique côté client la logique backend de génération d'ID de conversation.
 * Identique à messageModel.genererConversationId()
 */
export function buildConversationId(userId1: string, userId2: string): string {
  const ids = [userId1, userId2].sort();
  return `conv_${ids[0]}_${ids[1]}`;
}

/** Retourne l'autre participant à partir de l'id de conversation. */
export function getOtherParticipantId(
  conversationId: string,
  currentUserId: string,
): string | null {
  if (!conversationId.startsWith("conv_")) return null;
  const parts = conversationId.replace("conv_", "").split("_").filter(Boolean);
  if (parts.length !== 2) return null;
  return parts[0] === currentUserId ? parts[1] : parts[1] === currentUserId ? parts[0] : null;
}
