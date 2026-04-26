"use client";
import { useEffect, useMemo, useState } from "react";
import { Filter } from "lucide-react";
import { ListingCard } from "@/components/listings/ListingCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { api } from "@/lib/api";
import { cn } from "@/lib/cn";

type Listing = {
  id: string;
  type: string;
  title: string;
  description: string;
  coverUrl: string | null;
  location: string;
  startsAt: string;
  capacity: number;
  priceCents: number;
  packSize: number | null;
  owner: { id: string; name: string; companyName: string | null; role: string };
  _count: { tickets: number };
};

type TypeFilter = "ALL" | "EVENTO" | "CLASE" | "PACK";
type PriceFilter = "ALL" | "FREE" | "PAID";

export default function ExplorarPage() {
  const [listings, setListings] = useState<Listing[] | null>(null);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("ALL");
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("ALL");

  useEffect(() => {
    api<Listing[]>("/api/listings").then(setListings).catch(() => setListings([]));
  }, []);

  const filtered = useMemo(() => {
    if (!listings) return null;
    return listings.filter((l) => {
      if (typeFilter !== "ALL" && l.type !== typeFilter) return false;
      if (priceFilter === "FREE" && l.priceCents !== 0) return false;
      if (priceFilter === "PAID" && l.priceCents === 0) return false;
      return true;
    });
  }, [listings, typeFilter, priceFilter]);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900 sm:text-3xl">Explorar</h1>
          <p className="text-sm text-ink-500">Clases, eventos y packs disponibles.</p>
        </div>
      </header>

      <div className="card flex flex-wrap items-center gap-3 p-3" data-tour="explorar.filters">
        <div className="flex items-center gap-2 px-2 text-sm text-ink-500">
          <Filter size={14} /> Filtros
        </div>
        <Group<TypeFilter>
          options={[
            { v: "ALL", label: "Todo" },
            { v: "EVENTO", label: "Eventos" },
            { v: "CLASE", label: "Clases" },
            { v: "PACK", label: "Packs" },
          ]}
          value={typeFilter}
          onChange={setTypeFilter}
        />
        <span className="hidden h-6 w-px bg-ink-200 sm:block" />
        <Group<PriceFilter>
          options={[
            { v: "ALL", label: "Todos los precios" },
            { v: "FREE", label: "Gratis" },
            { v: "PAID", label: "Pagas" },
          ]}
          value={priceFilter}
          onChange={setPriceFilter}
        />
      </div>

      {filtered === null ? (
        <SkeletonGrid />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Nada coincide con tus filtros"
          hint="Probas cambiar tipo o precio. El proto trae 6 listings de demo en el seed."
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((l, i) => (
            <ListingCard key={l.id} listing={l} tour={i === 0 ? "explorar.first-card" : undefined} />
          ))}
        </div>
      )}
    </div>
  );
}

function Group<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { v: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1">
      {options.map((o) => (
        <button
          key={o.v}
          type="button"
          onClick={() => onChange(o.v)}
          className={cn(
            "rounded-full px-3 py-1.5 text-sm font-medium transition",
            value === o.v
              ? "bg-brand-600 text-white"
              : "text-ink-700 hover:bg-ink-100",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="card overflow-hidden">
          <div className="aspect-[2/1] animate-pulse bg-ink-100" />
          <div className="space-y-2 p-5">
            <div className="h-4 w-3/4 animate-pulse rounded bg-ink-100" />
            <div className="h-3 w-full animate-pulse rounded bg-ink-100" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-ink-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
