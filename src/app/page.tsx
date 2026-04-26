import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Stat } from "@/components/ui/Stat";
import { db } from "@/lib/db";
import { ListingCard } from "@/components/listings/ListingCard";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const featured = await db.listing.findMany({
    take: 3,
    orderBy: { startsAt: "asc" },
    include: {
      owner: { select: { id: true, name: true, companyName: true, role: true } },
      _count: { select: { tickets: true } },
    },
  });

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="relative pt-6 text-center">
        <span className="pill mx-auto">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
          Marketplace de eventos y clases
        </span>
        <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-ink-900 sm:text-5xl md:text-6xl">
          Tu agenda, tus QRs,
          <br />
          <span className="text-brand-600">tu control.</span>
        </h1>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link href="/explorar" data-tour="landing.hero-cta">
            <Button size="lg">
              Explorar clases y eventos <ArrowRight size={16} />
            </Button>
          </Link>
        </div>

        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-3 gap-3">
          <Stat value="0$" label="Plan gratuito" />
          <Stat value="∞" label="Listings ilimitados" />
          <Stat value="100%" label="Tu marca" />
        </div>
      </section>

      {/* Featured listings — el producto se explica solo */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-ink-900 sm:text-3xl">Proximas en el catalogo</h2>
            <p className="mt-1 text-ink-500">Hace clic en una para ver el flujo completo.</p>
          </div>
          <Link href="/explorar" className="hidden text-sm font-medium text-brand-700 hover:text-brand-800 sm:inline">
            Ver todo →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {featured.map((l, i) => (
            <ListingCard
              key={l.id}
              listing={l}
              tour={i === 0 ? "landing.first-card" : undefined}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
