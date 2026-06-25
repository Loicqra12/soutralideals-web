"use client";

import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores";
import { buildConversationId } from "@/lib/utils/conversationId";

interface StartConversationButtonProps {
  /** _id de l'utilisateur propriétaire du profil (pas l'id du prestataire/freelance) */
  destinataireUserId?: string;
  label?: string;
  className?: string;
  size?: "sm" | "lg" | "default";
  variant?: "default" | "outline";
}

export function StartConversationButton({
  destinataireUserId,
  label = "Envoyer un message",
  className,
  size = "lg",
  variant = "outline",
}: StartConversationButtonProps) {
  const router = useRouter();
  const utilisateur = useAuthStore((s) => s.utilisateur);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const handleClick = () => {
    if (!isAuthenticated) {
      toast.error("Connectez-vous pour envoyer un message.");
      router.push("/connexion?redirect=/messages");
      return;
    }
    if (!destinataireUserId) {
      toast.error("Impossible de démarrer la conversation.");
      return;
    }
    if (destinataireUserId === utilisateur?._id) {
      toast.error("Vous ne pouvez pas vous envoyer un message.");
      return;
    }
    const convId = buildConversationId(utilisateur!._id, destinataireUserId);
    router.push(`/messages/${convId}`);
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleClick}
    >
      <MessageSquare className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}
