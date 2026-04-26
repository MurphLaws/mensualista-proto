import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getActiveUser } from "@/lib/role";

export async function POST(req: Request) {
  const user = await getActiveUser();
  if (user.role !== "EMPRESA") {
    return NextResponse.json({ error: "Solo empresas pueden escanear" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const code: string | undefined = body?.code?.trim();
  if (!code) {
    return NextResponse.json({ result: "INVALID", message: "Codigo vacio" }, { status: 400 });
  }

  const ticket = await db.ticket.findUnique({
    where: { code },
    include: {
      listing: { include: { owner: true } },
      holder: { select: { name: true } },
    },
  });

  if (!ticket) {
    return NextResponse.json({ result: "INVALID", message: "Codigo no encontrado" });
  }

  // Only the listing owner (the empresa that issued it) can scan
  if (ticket.listing.ownerId !== user.id) {
    return NextResponse.json({
      result: "INVALID",
      message: "Este ticket pertenece a otra empresa",
      listingTitle: ticket.listing.title,
    });
  }

  if (ticket.status === "REDEEMED") {
    await db.scan.create({
      data: { ticketId: ticket.id, scannedById: user.id, result: "DUP" },
    });
    return NextResponse.json({
      result: "DUP",
      message: "Ticket ya fue usado",
      listingTitle: ticket.listing.title,
      holderName: ticket.holder.name,
      remaining: 0,
    });
  }

  if (ticket.status === "EXHAUSTED" || ticket.remainingUses <= 0) {
    await db.scan.create({
      data: { ticketId: ticket.id, scannedById: user.id, result: "EXHAUSTED" },
    });
    return NextResponse.json({
      result: "EXHAUSTED",
      message: "Ticket sin usos restantes",
      listingTitle: ticket.listing.title,
      holderName: ticket.holder.name,
      remaining: 0,
    });
  }

  // Decrement
  const newRemaining = ticket.remainingUses - 1;
  const newStatus = newRemaining <= 0 ? (ticket.remainingUses > 1 ? "EXHAUSTED" : "REDEEMED") : "ACTIVE";

  await db.ticket.update({
    where: { id: ticket.id },
    data: { remainingUses: newRemaining, status: newStatus },
  });
  await db.scan.create({
    data: { ticketId: ticket.id, scannedById: user.id, result: "OK" },
  });

  return NextResponse.json({
    result: "OK",
    message: "Acceso autorizado",
    listingTitle: ticket.listing.title,
    holderName: ticket.holder.name,
    remaining: newRemaining,
    listingType: ticket.listing.type,
  });
}

export async function GET() {
  const user = await getActiveUser();
  if (user.role !== "EMPRESA") {
    return NextResponse.json({ error: "Solo empresas" }, { status: 403 });
  }
  const scans = await db.scan.findMany({
    where: { scannedById: user.id },
    orderBy: { scannedAt: "desc" },
    take: 12,
    include: {
      ticket: { include: { listing: { select: { title: true } }, holder: { select: { name: true } } } },
    },
  });
  return NextResponse.json(scans);
}
