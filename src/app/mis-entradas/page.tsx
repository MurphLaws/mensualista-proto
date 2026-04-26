"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Calendar, MapPin, QrCode } from "lucide-react";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { formatDate, formatPrice, formatType } from "@/lib/format";
import { onRoleChange } from "@/lib/role-client";

type Ticket = {
  id: string;
  code: string;
  status: string;
  remainingUses: number;
  purchasedAt: string;
  listing: {
    id: string;
    type: string;
    title: string;
    location: string;
    startsAt: string;
    priceCents: number;
    packSize: number | null;
    owner: { name: string; companyName: string | null };
  };
};

export default function MisEntradasPage() {
  const [items, setItems] = useState<Ticket[] | null>(null);

  function load() {
    api<Ticket[]>("/api/me/tickets").then(setItems).catch(() => setItems([]));
  }

  useEffect(() => {
    load();
    return onRoleChange(load);
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-ink-900 sm:text-3xl">Mis entradas</h1>
        <p className="text-sm text-ink-500">
          QRs activos. Mostralos en la puerta para entrar. Cada rol tiene su propia billetera.
        </p>
      </header>

      {items === null ? (
        <Skeleton />
      ) : items.length === 0 ? (
        <EmptyState
          title="Aun no tenes entradas"
          hint="Inscribite en un evento gratis o compra una clase para verlo aca."
          action={
            <Link href="/explorar">
              <Button>Explorar listings</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {items.map((t, i) => (
            <Link
              key={t.id}
              href={`/tickets/${t.code}`}
              data-tour={i === 0 ? "wallet.first-ticket" : undefined}
              className="card p-5 transition hover:-translate-y-0.5 hover:shadow-soft"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="brand">{formatType(t.listing.type)}</Badge>
                <Badge tone={t.status === "ACTIVE" ? "success" : t.status === "EXHAUSTED" ? "warn" : "neutral"}>
                  {t.status === "ACTIVE" ? "Activo" : t.status === "REDEEMED" ? "Usado" : "Agotado"}
                </Badge>
                {t.listing.type === "PACK" && (
                  <Badge tone="warn">{t.remainingUses} usos restantes</Badge>
                )}
                {t.listing.priceCents > 0 ? (
                  <Badge tone="neutral">{formatPrice(t.listing.priceCents)}</Badge>
                ) : (
                  <Badge tone="success">Gratis</Badge>
                )}
              </div>
              <h3 className="mt-3 text-base font-semibold text-ink-900">{t.listing.title}</h3>
              <div className="mt-2 space-y-1 text-xs text-ink-500">
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} />
                  {formatDate(t.listing.startsAt)}
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={13} />
                  {t.listing.location}
                </div>
                <div className="flex items-center gap-1.5">
                  <QrCode size={13} />
                  <span className="font-mono">{t.code.slice(0, 8)}…</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="card space-y-3 p-5">
          <div className="h-3 w-1/3 animate-pulse rounded bg-ink-100" />
          <div className="h-5 w-2/3 animate-pulse rounded bg-ink-100" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-ink-100" />
        </div>
      ))}
    </div>
  );
}
