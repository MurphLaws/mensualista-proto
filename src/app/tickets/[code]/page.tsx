import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/Badge";
import { TicketQR } from "@/components/tickets/TicketQR";
import { formatDate, formatPrice, formatType } from "@/lib/format";

export default async function TicketDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const { code } = await params;
  const sp = await searchParams;
  const ticket = await db.ticket.findUnique({
    where: { code },
    include: {
      listing: { include: { owner: { select: { name: true, companyName: true } } } },
      holder: { select: { name: true } },
    },
  });
  if (!ticket) notFound();

  const showSuccess = sp.from === "mis-entradas";
  const isPack = ticket.listing.type === "PACK";

  return (
    <div className="mx-auto max-w-md space-y-5">
      {showSuccess && (
        <div className="flex items-start gap-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800 ring-1 ring-emerald-200">
          <CheckCircle2 size={18} className="mt-0.5" />
          <div>
            <div className="font-semibold">Listo!</div>
            <div className="opacity-80">Tu QR esta abajo. Mostralo en la puerta o copialo para el demo.</div>
          </div>
        </div>
      )}

      <div className="card p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="brand">{formatType(ticket.listing.type)}</Badge>
          <Badge tone={ticket.status === "ACTIVE" ? "success" : "neutral"}>
            {ticket.status === "ACTIVE" ? "Activo" : ticket.status === "REDEEMED" ? "Usado" : "Agotado"}
          </Badge>
          {isPack && <Badge tone="warn">{ticket.remainingUses} usos restantes</Badge>}
          {ticket.listing.priceCents > 0 ? (
            <Badge tone="neutral">{formatPrice(ticket.listing.priceCents)}</Badge>
          ) : (
            <Badge tone="success">Gratis</Badge>
          )}
        </div>
        <h1 className="mt-3 text-xl font-semibold tracking-tight text-ink-900">{ticket.listing.title}</h1>
        <p className="mt-1 text-sm text-ink-500">
          {formatDate(ticket.listing.startsAt)} · {ticket.listing.location}
        </p>
        <p className="mt-1 text-xs text-ink-400">
          A nombre de {ticket.holder.name} · por {ticket.listing.owner.companyName ?? ticket.listing.owner.name}
        </p>
      </div>

      <div className="card flex flex-col items-center gap-2 p-6">
        <TicketQR code={ticket.code} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <Link href="/mis-entradas" className="text-brand-700 hover:text-brand-800">
          Ver todas mis entradas →
        </Link>
        <Link href="/explorar" className="text-ink-500 hover:text-ink-700">
          Seguir explorando
        </Link>
      </div>
    </div>
  );
}
