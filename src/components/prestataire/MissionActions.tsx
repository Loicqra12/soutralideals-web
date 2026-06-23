"use client";

import { useState } from "react";
import { Check, Loader2, Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Prestation } from "@/types/prestation";
import { usePrestationActions } from "@/lib/hooks/usePrestationActions";

interface MissionActionsProps {
  mission: Prestation;
  prestataireId?: string;
}

export function MissionActions({ mission, prestataireId }: MissionActionsProps) {
  const { updateStatut, isUpdating } = usePrestationActions(prestataireId);
  const [localError, setLocalError] = useState("");

  const statut = mission.statut ?? "EN_ATTENTE";

  const handleAction = async (nextStatut: string) => {
    setLocalError("");
    try {
      await updateStatut({ id: mission._id, statut: nextStatut });
    } catch (err) {
      setLocalError(
        err instanceof Error ? err.message : "Action impossible.",
      );
    }
  };

  const showAccept = statut === "EN_ATTENTE";
  const showReject = statut === "EN_ATTENTE";
  const showStart = statut === "ACCEPTEE";
  const showComplete = statut === "EN_COURS";

  if (!showAccept && !showReject && !showStart && !showComplete) {
    return null;
  }

  return (
    <div className="flex shrink-0 flex-col gap-2 sm:items-end">
      <div className="flex flex-wrap gap-2">
        {showAccept && (
          <Button
            size="sm"
            disabled={isUpdating}
            onClick={() => handleAction("ACCEPTEE")}
          >
            {isUpdating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Check className="mr-1 h-4 w-4" />
                Accepter
              </>
            )}
          </Button>
        )}
        {showReject && (
          <Button
            size="sm"
            variant="outline"
            disabled={isUpdating}
            className="text-red-600 hover:text-red-700"
            onClick={() => handleAction("REFUSEE")}
          >
            <X className="mr-1 h-4 w-4" />
            Refuser
          </Button>
        )}
        {showStart && (
          <Button
            size="sm"
            disabled={isUpdating}
            onClick={() => handleAction("EN_COURS")}
          >
            <Play className="mr-1 h-4 w-4" />
            Démarrer
          </Button>
        )}
        {showComplete && (
          <Button
            size="sm"
            disabled={isUpdating}
            onClick={() => handleAction("TERMINEE")}
          >
            <Check className="mr-1 h-4 w-4" />
            Terminer
          </Button>
        )}
      </div>
      {localError && (
        <p className="text-xs text-red-600" role="alert">
          {localError}
        </p>
      )}
    </div>
  );
}
