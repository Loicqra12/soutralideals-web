import type { Message, MessageUser } from "@/lib/api/messages";
import { getOtherParticipantId } from "@/lib/utils/conversationId";

/** Id utilisateur depuis un champ expediteur/destinataire (populate ou ObjectId). */
export function getMessageParticipantId(
  user: MessageUser | string | null | undefined,
): string | null {
  if (user == null) return null;
  if (typeof user === "string") return user;
  return user._id ?? null;
}

/** Déduit l'autre participant à partir des messages ou de l'id de conversation. */
export function resolveOtherParticipantId(
  messages: Message[],
  currentUserId: string,
  conversationId: string,
): string | null {
  for (const msg of messages) {
    const expId = getMessageParticipantId(msg.expediteur);
    const destId = getMessageParticipantId(msg.destinataire);

    if (expId === currentUserId && destId) return destId;
    if (destId === currentUserId && expId) return expId;
  }

  return getOtherParticipantId(conversationId, currentUserId);
}

/** Infos affichables de l'autre participant si populate backend OK. */
export function resolveOtherParticipantProfile(
  messages: Message[],
  currentUserId: string,
): MessageUser | null {
  for (const msg of messages) {
    const expId = getMessageParticipantId(msg.expediteur);
    const destId = getMessageParticipantId(msg.destinataire);

    if (expId === currentUserId && msg.destinataire && typeof msg.destinataire === "object") {
      return msg.destinataire;
    }
    if (destId === currentUserId && msg.expediteur && typeof msg.expediteur === "object") {
      return msg.expediteur;
    }
  }
  return null;
}
