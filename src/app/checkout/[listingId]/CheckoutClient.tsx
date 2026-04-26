"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FakeStripeCheckout } from "@/components/checkout/FakeStripeCheckout";
import { api } from "@/lib/api";
import { getClientRole, setClientRole } from "@/lib/role-client";
import { Button } from "@/components/ui/Button";

export function CheckoutClient({
  listingId,
  priceCents,
  title,
  packSize,
}: {
  listingId: string;
  priceCents: number;
  title: string;
  packSize: number | null;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [needsRole, setNeedsRole] = useState(false);

  useEffect(() => {
    if (getClientRole() !== "VISITANTE") setNeedsRole(true);
  }, []);

  if (needsRole) {
    return (
      <div className="card p-5 space-y-3 text-sm">
        <p className="text-ink-700">
          El checkout es para visitantes. Cambia tu rol para continuar la demo.
        </p>
        <Button
          onClick={() => {
            setClientRole("VISITANTE");
            setNeedsRole(false);
            router.refresh();
          }}
        >
          Cambiar a Visitante y continuar
        </Button>
      </div>
    );
  }

  return (
    <>
      <FakeStripeCheckout
        amountCents={priceCents}
        title={title + (packSize ? ` · pack de ${packSize}` : "")}
        onCancel={() => router.back()}
        onSuccess={async (paymentRef) => {
          try {
            const ticket = await api<{ code: string }>("/api/tickets", {
              method: "POST",
              body: JSON.stringify({ listingId, paymentRef }),
            });
            router.push(`/tickets/${ticket.code}?from=mis-entradas`);
          } catch (e) {
            setError((e as Error).message);
          }
        }}
      />
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </>
  );
}
