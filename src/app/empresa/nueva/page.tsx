import { NuevaListingForm } from "./NuevaListingForm";

export default function NuevaListingPage() {
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-semibold tracking-tight text-ink-900">Nueva clase o pack</h1>
      <p className="mt-1 text-sm text-ink-500">Se publica al instante. Lo podes editar despues.</p>
      <div className="mt-6">
        <NuevaListingForm />
      </div>
    </div>
  );
}
