import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { TutorialProvider } from "@/components/tutorial/TutorialProvider";
import { RoleHeaderBridge } from "@/components/layout/RoleHeaderBridge";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Mensualista — Eventos y clases con QR",
  description:
    "Marketplace para empresas, particulares y visitantes. Inscripciones gratis, packs y clases pagas con QR.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="min-h-screen bg-white">
        <RoleHeaderBridge />
        <TutorialProvider>
          <Header />
          <main className="container-app py-8 pb-28">{children}</main>
          <BottomNav />
        </TutorialProvider>
      </body>
    </html>
  );
}
