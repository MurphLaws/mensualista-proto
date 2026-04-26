import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getActiveUser } from "@/lib/role";

export async function GET() {
  const user = await getActiveUser();
  if (user.role !== "EMPRESA") {
    return NextResponse.json({ error: "Solo empresas" }, { status: 403 });
  }

  const [listings, tickets, scans] = await Promise.all([
    db.listing.count({ where: { ownerId: user.id } }),
    db.ticket.count({ where: { listing: { ownerId: user.id } } }),
    db.scan.count({ where: { scannedById: user.id, result: "OK" } }),
  ]);

  return NextResponse.json({ listings, tickets, scans });
}
