"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { getClientRole, onRoleChange } from "@/lib/role-client";
import { ROLE_LABEL, type Role } from "@/lib/role-shared";

export function ListingActionButton({
  listingId,
  priceCents,
  isFull,
  title,
}: {
  listingId: string;
  priceCents: number;
  isFull: boolean;
  title: string;
}) {
  const router = useRouter();
  const [role, setRole] = useState<Role>("VISITANTE");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setRole(getClientRole());
    return onRoleChange(setRole);
  }, []);

  async function inscribir() {
    setErr(null);
    setLoading(true);
    try {
      const ticket = await api<{ id: string; code: string }>("/api/tickets", {
        method: "POST",
        body: JSON.stringify({ listingId }),
      });
      router.push(`/tickets/${ticket.code}?from=mis-entradas`);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function comprar() {
    router.push(`/checkout/${listingId}`);
  }

  if (role !== "VISITANTE") {
    return (
      <div className="card p-5 text-sm text-ink-500" data-tour="listing.cta">
        Para inscribirte o comprar, cambia tu rol a <strong className="text-ink-700">{ROLE_LABEL.VISITANTE}</strong> desde la barra superior.
      </div>
    );
  }

  if (isFull) {
    return (
      <div className="card p-5 text-sm text-ink-500" data-tour="listing.cta">
        Este listing ya cubrio su capacidad maxima. Probas con otro de la lista.
      </div>
    );
  }

  if (priceCents === 0) {
    return (
      <div data-tour="listing.cta" className="space-y-2">
        <Button onClick={inscribir} disabled={loading} className="w-full" size="lg">
          {loading ? "Generando QR..." : "Inscribirme gratis"}
        </Button>
        {err && <p className="text-sm text-red-600">{err}</p>}
      </div>
    );
  }

  return (
    <div data-tour="listing.cta" className="space-y-2">
      <Button onClick={comprar} className="w-full" size="lg">
        Comprar entrada — {(priceCents / 100).toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 })}
      </Button>
      <p className="text-xs text-ink-500" title={title}>
        Pago de demo. No se cobra dinero real.
      </p>
    </div>
  );
}
