import { NuevoEventoForm } from "./NuevoEventoForm";

export default function NuevoEventoPage() {
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-semibold tracking-tight text-ink-900">Nuevo evento</h1>
      <p className="mt-1 text-sm text-ink-500">Los eventos de particulares son siempre gratis.</p>
      <div className="mt-6">
        <NuevoEventoForm />
      </div>
    </div>
  );
}
