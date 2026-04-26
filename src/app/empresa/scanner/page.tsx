import Link from "next/link";
import { ScanLine } from "lucide-react";
import { getActiveUser } from "@/lib/role";
import { EmptyState } from "@/components/ui/EmptyState";
import { QrScanner } from "@/components/scanner/QrScanner";

export default async function ScannerPage() {
  const user = await getActiveUser();
  if (user.role !== "EMPRESA") {
    return (
      <EmptyState
        title="Solo para empresas"
        hint="El scanner es la pantalla que la empresa abre en la entrada del estudio. Cambia tu rol a Empresa para verlo."
      />
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold text-ink-900 sm:text-3xl">Scanner de QR</h1>
          <span className="pill">
            <ScanLine size={14} /> {user.companyName ?? user.name}
          </span>
        </div>
        <p className="mt-1 text-sm text-ink-500">
          Pone el QR del visitante frente a la camara, o pega el codigo manualmente.{" "}
          <Link href="/empresa" className="text-brand-700 hover:text-brand-800">
            Volver al panel →
          </Link>
        </p>
      </header>
      <QrScanner />
    </div>
  );
}
