import Link from "next/link";
import { Calendar, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatDate, formatPrice, formatType } from "@/lib/format";

type Props = {
  listing: {
    id: string;
    type: string;
    title: string;
    description: string;
    coverUrl: string | null;
    location: string;
    startsAt: Date | string;
    capacity: number;
    priceCents: number;
    packSize: number | null;
    owner: { name: string; companyName: string | null; role: string };
    _count: { tickets: number };
  };
  tour?: string;
};

export function ListingCard({ listing, tour }: Props) {
  const seatsLeft = Math.max(0, listing.capacity - listing._count.tickets);
  const isPack = listing.type === "PACK";

  return (
    <Link
      href={`/listings/${listing.id}`}
      data-tour={tour}
      className="card group flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-soft"
    >
      <div className="aspect-[2/1] w-full overflow-hidden bg-ink-100">
        {listing.coverUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={listing.coverUrl}
            alt={listing.title}
            className="h-full w-full object-cover transition group-hover:scale-[1.02]"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-2">
          <Badge tone="brand">{formatType(listing.type)}</Badge>
          {isPack && listing.packSize && (
            <Badge tone="neutral">{listing.packSize} usos</Badge>
          )}
          {listing.priceCents === 0 ? (
            <Badge tone="success">Gratis</Badge>
          ) : (
            <Badge tone="neutral">{formatPrice(listing.priceCents)}</Badge>
          )}
        </div>
        <div>
          <h3 className="text-base font-semibold text-ink-900">{listing.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-ink-500">{listing.description}</p>
        </div>
        <div className="mt-auto space-y-1.5 text-xs text-ink-500">
          <div className="flex items-center gap-1.5">
            <Calendar size={14} />
            {formatDate(listing.startsAt)}
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin size={14} />
            {listing.location}
          </div>
          <div className="flex items-center gap-1.5">
            <Users size={14} />
            {seatsLeft === 0 ? "Sin cupos" : `${seatsLeft} cupos disponibles`}
          </div>
        </div>
        <div className="text-xs text-ink-400">
          por {listing.owner.companyName ?? listing.owner.name}
        </div>
      </div>
    </Link>
  );
}
