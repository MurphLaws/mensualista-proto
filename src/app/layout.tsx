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
          <main className="container-app py-8 pb-28 md:pb-8">{children}</main>
          <footer className="container-app mt-16 hidden border-t border-ink-100 py-8 text-sm text-ink-400 md:block">
            <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
              <span>© {new Date().getFullYear()} Mensualista — proto demo.</span>
              <span>Hecho para experimentar. No procesa pagos reales.</span>
            </div>
          </footer>
          <BottomNav />
        </TutorialProvider>
      </body>
    </html>
  );
}
