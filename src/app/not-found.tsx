import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-[8rem] font-black leading-none text-neutral-100 select-none">
        404
      </p>
      <h1 className="-mt-4 text-2xl font-bold text-neutral-900">
        Page introuvable
      </h1>
      <p className="mt-3 max-w-sm text-neutral-500">
        La page que vous cherchez n&apos;existe pas ou a été déplacée.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/">Retour à l&apos;accueil</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/prestataires">Voir les prestataires</Link>
        </Button>
      </div>
    </div>
  );
}
