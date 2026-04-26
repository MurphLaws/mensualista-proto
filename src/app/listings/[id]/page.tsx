import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, MapPin, Users } from "lucide-react";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/Badge";
import { formatDate, formatPrice, formatType } from "@/lib/format";
import { ListingActionButton } from "./ListingActionButton";

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await db.listing.findUnique({
    where: { id },
    include: {
      owner: { select: { id: true, name: true, companyName: true, role: true } },
      _count: { select: { tickets: true } },
    },
  });
  if (!listing) notFound();

  const seatsLeft = Math.max(0, listing.capacity - listing._count.tickets);
  const isFull = seatsLeft === 0;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.5fr_1fr]">
      <div>
        <Link href="/explorar" className="text-sm text-ink-500 hover:text-brand-700">
          ← Volver a explorar
        </Link>
        <div className="mt-3 overflow-hidden rounded-2xl">
          {listing.coverUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={listing.coverUrl} alt={listing.title} className="aspect-[2/1] w-full object-cover" />
          )}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Badge tone="brand">{formatType(listing.type)}</Badge>
          {listing.type === "PACK" && listing.packSize && <Badge tone="neutral">{listing.packSize} usos</Badge>}
          {listing.priceCents === 0 ? (
            <Badge tone="success">Gratis</Badge>
          ) : (
            <Badge tone="neutral">{formatPrice(listing.priceCents)}</Badge>
          )}
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink-900">{listing.title}</h1>
        <p className="mt-1 text-sm text-ink-500">
          por <span className="font-medium text-ink-700">{listing.owner.companyName ?? listing.owner.name}</span>
        </p>
        <p className="mt-5 max-w-prose text-base leading-relaxed text-ink-700">{listing.description}</p>
      </div>

      <aside className="space-y-4">
        <div className="card space-y-3 p-5" data-tour="listing.meta">
          <Row icon={<Calendar size={16} />} label="Fecha" value={formatDate(listing.startsAt)} />
          <Row icon={<MapPin size={16} />} label="Ubicacion" value={listing.location} />
          <Row
            icon={<Users size={16} />}
            label="Cupos"
            value={isFull ? "Sin cupos" : `${seatsLeft} de ${listing.capacity}`}
          />
          <div className="border-t border-ink-100 pt-3">
            <div className="text-xs uppercase tracking-wide text-ink-400">Precio</div>
            <div className="mt-1 text-2xl font-semibold text-ink-900">
              {formatPrice(listing.priceCents)}
            </div>
            {listing.type === "PACK" && listing.packSize && (
              <p className="text-xs text-ink-500">
                Un solo QR escaneable {listing.packSize} veces.
              </p>
            )}
          </div>
        </div>

        <ListingActionButton
          listingId={listing.id}
          priceCents={listing.priceCents}
          isFull={isFull}
          title={listing.title}
        />
      </aside>
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-ink-500">{icon}</span>
      <div>
        <div className="text-xs uppercase tracking-wide text-ink-400">{label}</div>
        <div className="text-sm text-ink-900">{value}</div>
      </div>
    </div>
  );
}
