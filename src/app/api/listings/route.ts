import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getActiveUser } from "@/lib/role";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const type = url.searchParams.get("type"); // EVENTO | CLASE | PACK | null
  const free = url.searchParams.get("free"); // "1" | null

  const where: Record<string, unknown> = {};
  if (type === "EVENTO" || type === "CLASE" || type === "PACK") where.type = type;
  if (free === "1") where.priceCents = 0;

  const listings = await db.listing.findMany({
    where,
    orderBy: { startsAt: "asc" },
    include: {
      owner: { select: { id: true, name: true, companyName: true, role: true } },
      _count: { select: { tickets: true } },
    },
  });

  return NextResponse.json(listings);
}

export async function POST(req: Request) {
  const user = await getActiveUser();
  const body = await req.json().catch(() => ({}));
  const {
    type,
    title,
    description,
    location,
    startsAt,
    capacity,
    priceCents,
    packSize,
    coverUrl,
  } = body ?? {};

  if (!type || !["EVENTO", "CLASE", "PACK"].includes(type)) {
    return NextResponse.json({ error: "Tipo invalido" }, { status: 400 });
  }
  if (type === "EVENTO" && user.role !== "PARTICULAR") {
    return NextResponse.json({ error: "Solo particulares crean eventos" }, { status: 403 });
  }
  if ((type === "CLASE" || type === "PACK") && user.role !== "EMPRESA") {
    return NextResponse.json({ error: "Solo empresas crean clases o packs" }, { status: 403 });
  }
  if (!title?.trim() || !location?.trim() || !startsAt || !capacity) {
    return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
  }

  const listing = await db.listing.create({
    data: {
      type,
      ownerId: user.id,
      title: title.trim(),
      description: description?.trim() ?? "",
      location: location.trim(),
      startsAt: new Date(startsAt),
      capacity: Number(capacity),
      priceCents: type === "EVENTO" ? 0 : Number(priceCents ?? 0),
      packSize: type === "PACK" ? Math.max(1, Number(packSize ?? 1)) : null,
      coverUrl: coverUrl ?? null,
    },
  });

  return NextResponse.json(listing, { status: 201 });
}
