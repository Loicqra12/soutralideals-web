import { Navbar } from "./Navbar";
import { MobileHeader } from "./MobileHeader";
import { BottomNav } from "./BottomNav";
import { Footer } from "./Footer";
import { CookieBanner } from "@/components/consent/CookieBanner";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Desktop navbar */}
      <Navbar />
      {/* Mobile header (logo + recherche + panier + notifs) */}
      <MobileHeader />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <Footer />
      {/* Mobile bottom nav (Accueil / Métiers / Freelance / E-marché / Profil) */}
      <BottomNav />
      <CookieBanner />
    </>
  );
}
