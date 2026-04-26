import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { getActiveUser } from "@/lib/role";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate, formatType } from "@/lib/format";

export default async function ParticularPage() {
  const user = await getActiveUser();
  if (user.role !== "PARTICULAR") {
    return (
      <EmptyState
        title="Cambia tu rol a Particular"
        hint="Esta pantalla es para particulares que organizan eventos gratuitos. Cambia el rol desde la barra superior."
      />
    );
  }

  const events = await db.listing.findMany({
    where: { ownerId: user.id },
    orderBy: { startsAt: "asc" },
    include: { _count: { select: { tickets: true } } },
  });

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900 sm:text-3xl">Mis eventos</h1>
          <p className="text-sm text-ink-500">Eventos personales gratis. Compartilos para que se anoten.</p>
        </div>
        <Link href="/particular/nuevo" data-tour="particular.create">
          <Button>
            <Plus size={16} /> Crear evento
          </Button>
        </Link>
      </header>

      {events.length === 0 ? (
        <EmptyState
          title="No hay eventos todavia"
          hint="Crea tu primer evento gratuito y compartilo. La gente se inscribe y recibe su QR."
          action={
            <Link href="/particular/nuevo">
              <Button>Crear el primero</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {events.map((e) => (
            <Link key={e.id} href={`/listings/${e.id}`} className="card p-5 hover:shadow-soft">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="brand">{formatType(e.type)}</Badge>
                <Badge tone="success">Gratis</Badge>
                <Badge tone="neutral">{e._count.tickets}/{e.capacity} inscriptos</Badge>
              </div>
              <h3 className="mt-3 text-base font-semibold text-ink-900">{e.title}</h3>
              <p className="mt-1 text-sm text-ink-500">
                {formatDate(e.startsAt)} · {e.location}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
