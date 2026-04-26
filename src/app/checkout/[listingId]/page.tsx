import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { CheckoutClient } from "./CheckoutClient";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ listingId: string }>;
}) {
  const { listingId } = await params;
  const listing = await db.listing.findUnique({
    where: { id: listingId },
    include: { _count: { select: { tickets: true } } },
  });
  if (!listing) notFound();

  const seatsLeft = Math.max(0, listing.capacity - listing._count.tickets);

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-semibold tracking-tight text-ink-900">Checkout</h1>
      <p className="mt-1 text-sm text-ink-500">
        Estas comprando <strong className="text-ink-900">{listing.title}</strong>.
      </p>
      {seatsLeft === 0 ? (
        <div className="mt-6 card p-5 text-sm text-ink-500">
          No quedan cupos disponibles.
        </div>
      ) : (
        <div className="mt-6">
          <CheckoutClient
            listingId={listing.id}
            priceCents={listing.priceCents}
            title={listing.title}
            packSize={listing.packSize}
          />
        </div>
      )}
    </div>
  );
}
