"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { MobileHeader } from "./MobileHeader";
import { BottomNav } from "./BottomNav";
import { Footer } from "./Footer";
import { CookieBanner } from "@/components/consent/CookieBanner";
import { FirebaseAnalyticsProvider } from "@/components/providers/FirebaseAnalyticsProvider";
import { ServiceWorkerProvider } from "@/components/providers/ServiceWorkerProvider";
import { SocketAuthProvider } from "@/components/providers/SocketAuthProvider";

const AUTH_ROUTES = ["/connexion", "/inscription"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (isAuthPage) {
    return (
      <>
        <main className="flex-1">{children}</main>
        <CookieBanner />
        <FirebaseAnalyticsProvider />
        <ServiceWorkerProvider />
        <SocketAuthProvider />
      </>
    );
  }

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
      <FirebaseAnalyticsProvider />
      <ServiceWorkerProvider />
      <SocketAuthProvider />
    </>
  );
}
