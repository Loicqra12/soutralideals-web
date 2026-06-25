/**
 * Réplique côté client la logique backend de génération d'ID de conversation.
 * Identique à messageModel.genererConversationId()
 */
export function buildConversationId(userId1: string, userId2: string): string {
  const ids = [userId1, userId2].sort();
  return `conv_${ids[0]}_${ids[1]}`;
}
