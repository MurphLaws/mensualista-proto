import { RoleSwitcher } from "@/components/layout/RoleSwitcher";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-ink-900">Ajustes</h1>
        <p className="mt-1 text-sm text-ink-500">
          Cambia tu rol activo para probar cada flujo de la demo.
        </p>
      </header>

      <section className="card space-y-3 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-400">Rol activo</h2>
        <p className="text-sm text-ink-600">
          Mensualista es una demo sin login. Cambia entre Particular y Empresa para ver el contenido de cada uno.
        </p>
        <div className="pt-1">
          <RoleSwitcher />
        </div>
      </section>

      <section className="card space-y-3 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-400">Acerca de</h2>
        <p className="text-sm text-ink-600">
          Prototipo de Mensualista. No procesa pagos reales ni guarda datos personales reales.
        </p>
      </section>
    </div>
  );
}
