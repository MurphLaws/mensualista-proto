import Link from "next/link";
import { Plus, ScanLine, TrendingUp, Ticket as TicketIcon, Calendar } from "lucide-react";
import { db } from "@/lib/db";
import { getActiveUser } from "@/lib/role";
import { Stat } from "@/components/ui/Stat";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate, formatPrice, formatType } from "@/lib/format";

export default async function EmpresaPage() {
  const user = await getActiveUser();

  if (user.role !== "EMPRESA") {
    return (
      <EmptyState
        title="Cambia tu rol a Empresa"
        hint="El panel de empresa solo se ve cuando estas en el rol Empresa. Cambialo desde la barra superior (a la derecha)."
      />
    );
  }

  const [listings, ticketsCount, scansCount] = await Promise.all([
    db.listing.findMany({
      where: { ownerId: user.id },
      orderBy: { startsAt: "asc" },
      include: { _count: { select: { tickets: true } } },
    }),
    db.ticket.count({ where: { listing: { ownerId: user.id } } }),
    db.scan.count({ where: { scannedById: user.id, result: "OK" } }),
  ]);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900 sm:text-3xl">Panel de {user.companyName ?? user.name}</h1>
          <p className="text-sm text-ink-500">Gestiona tus clases, packs y validaciones de QR.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/empresa/scanner" data-tour="empresa.scanner-link">
            <Button variant="outline">
              <ScanLine size={16} /> Abrir scanner
            </Button>
          </Link>
          <Link href="/empresa/nueva" data-tour="empresa.create">
            <Button>
              <Plus size={16} /> Nueva clase o pack
            </Button>
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3" data-tour="empresa.stats">
        <div className="card p-5">
          <div className="flex items-center justify-between text-xs uppercase tracking-wide text-ink-400">
            Listings activos <Calendar size={14} />
          </div>
          <div className="mt-2 text-3xl font-semibold text-ink-900">{listings.length}</div>
        </div>
        <div className="card p-5">
          <div className="flex items-center justify-between text-xs uppercase tracking-wide text-ink-400">
            Entradas emitidas <TicketIcon size={14} />
          </div>
          <div className="mt-2 text-3xl font-semibold text-ink-900">{ticketsCount}</div>
        </div>
        <div className="card p-5">
          <div className="flex items-center justify-between text-xs uppercase tracking-wide text-ink-400">
            Escaneos OK <TrendingUp size={14} />
          </div>
          <div className="mt-2 text-3xl font-semibold text-ink-900">{scansCount}</div>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-ink-900">Tus listings</h2>
        {listings.length === 0 ? (
          <EmptyState
            title="Aun no publicaste nada"
            hint="Crea tu primera clase o pack en menos de un minuto."
            action={
              <Link href="/empresa/nueva">
                <Button>Crear ahora</Button>
              </Link>
            }
          />
        ) : (
          <div className="card divide-y divide-ink-100 overflow-hidden">
            {listings.map((l) => {
              const seatsLeft = Math.max(0, l.capacity - l._count.tickets);
              return (
                <Link
                  key={l.id}
                  href={`/listings/${l.id}`}
                  className="flex flex-wrap items-center gap-3 px-5 py-4 hover:bg-brand-50/40"
                >
                  <div className="flex min-w-[260px] flex-1 items-center gap-2">
                    <Badge tone="brand">{formatType(l.type)}</Badge>
                    {l.type === "PACK" && l.packSize && <Badge tone="neutral">{l.packSize} usos</Badge>}
                    <span className="font-medium text-ink-900">{l.title}</span>
                  </div>
                  <Stat dense label="Cupos" value={`${seatsLeft}/${l.capacity}`} />
                  <Stat dense label="Vendidos" value={String(l._count.tickets)} />
                  <Stat dense label="Precio" value={formatPrice(l.priceCents)} />
                  <Stat dense label="Fecha" value={formatDate(l.startsAt)} />
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

