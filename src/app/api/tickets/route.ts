import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { db } from "@/lib/db";
import { getActiveUser } from "@/lib/role";

export async function POST(req: Request) {
  const user = await getActiveUser();
  const body = await req.json().catch(() => ({}));
  const { listingId, paymentRef } = body ?? {};

  if (!listingId) {
    return NextResponse.json({ error: "Falta listingId" }, { status: 400 });
  }

  const listing = await db.listing.findUnique({
    where: { id: listingId },
    include: { _count: { select: { tickets: true } } },
  });
  if (!listing) return NextResponse.json({ error: "Listing no existe" }, { status: 404 });

  // Capacity check
  if (listing._count.tickets >= listing.capacity) {
    return NextResponse.json({ error: "Sin cupos disponibles" }, { status: 409 });
  }

  // Paid listings require a paymentRef from the fake checkout
  if (listing.priceCents > 0 && !paymentRef) {
    return NextResponse.json({ error: "Falta pago para listing pago" }, { status: 402 });
  }

  // Don't double-issue free tickets to the same holder
  if (listing.priceCents === 0) {
    const dup = await db.ticket.findFirst({
      where: { listingId, holderId: user.id, status: { not: "EXHAUSTED" } },
    });
    if (dup) return NextResponse.json(dup);
  }

  const remainingUses = listing.packSize && listing.packSize > 1 ? listing.packSize : 1;

  const ticket = await db.ticket.create({
    data: {
      code: randomUUID(),
      listingId: listing.id,
      holderId: user.id,
      status: "ACTIVE",
      remainingUses,
      paymentRef: paymentRef ?? null,
    },
  });

  return NextResponse.json(ticket, { status: 201 });
}
