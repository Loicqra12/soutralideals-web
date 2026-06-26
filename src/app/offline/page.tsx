import Link from "next/link";
import { WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OfflinePage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <WifiOff className="h-16 w-16 text-neutral-300" aria-hidden />
      <h1 className="mt-6 text-2xl font-bold text-neutral-900">
        Vous êtes hors ligne
      </h1>
      <p className="mt-3 max-w-sm text-neutral-500">
        Vérifiez votre connexion internet, puis réessayez d&apos;accéder à
        Soutrali Deals.
      </p>
      <Button className="mt-8" asChild>
        <Link href="/">Retour à l&apos;accueil</Link>
      </Button>
    </div>
  );
}
