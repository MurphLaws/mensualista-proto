import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getActiveUser } from "@/lib/role";

export async function GET() {
  const user = await getActiveUser();
  const tickets = await db.ticket.findMany({
    where: { holderId: user.id },
    orderBy: { purchasedAt: "desc" },
    include: { listing: { include: { owner: { select: { name: true, companyName: true } } } } },
  });
  return NextResponse.json(tickets);
}
