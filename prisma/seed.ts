import { PrismaClient } from "@prisma/client";
import { randomUUID } from "node:crypto";

const db = new PrismaClient();

async function main() {
  const existing = await db.user.count();
  if (existing > 0) {
    console.log(`Seed skip: ${existing} usuarios ya presentes.`);
    return;
  }

  const aurora = await db.user.create({
    data: {
      id: "u_empresa_aurora",
      name: "Estudio Aurora",
      role: "EMPRESA",
      companyName: "Estudio Aurora",
    },
  });

  const carla = await db.user.create({
    data: {
      id: "u_particular_carla",
      name: "Carla Mendez",
      role: "PARTICULAR",
    },
  });

  const now = new Date();
  const days = (n: number) => new Date(now.getTime() + n * 86400000);

  await db.listing.createMany({
    data: [
      {
        id: "l_yoga",
        type: "CLASE",
        ownerId: aurora.id,
        title: "Yoga Vinyasa al amanecer",
        description:
          "Clase de 60 minutos enfocada en flexibilidad y respiracion. Apta para todos los niveles. Trae tu mat.",
        coverUrl: "/covers/yoga.svg",
        location: "Estudio Aurora — Sala 1, Palermo",
        startsAt: days(2),
        capacity: 18,
        priceCents: 4500,
      },
      {
        id: "l_pilates",
        type: "CLASE",
        ownerId: aurora.id,
        title: "Pilates reformer intermedio",
        description:
          "Trabaja core, postura y fuerza. 50 minutos en reformer. Cupos limitados a 8 personas.",
        coverUrl: "/covers/pilates.svg",
        location: "Estudio Aurora — Sala 2, Palermo",
        startsAt: days(3),
        capacity: 8,
        priceCents: 6800,
      },
      {
        id: "l_funcional",
        type: "CLASE",
        ownerId: aurora.id,
        title: "Funcional al aire libre",
        description:
          "Entrenamiento al aire libre, alta intensidad. Bandas y peso corporal. Llueva o truene (techo cubierto).",
        coverUrl: "/covers/funcional.svg",
        location: "Plaza Aurora",
        startsAt: days(4),
        capacity: 25,
        priceCents: 3500,
      },
      {
        id: "l_yoga_past",
        type: "CLASE",
        ownerId: aurora.id,
        title: "Yoga restaurativo (pasada)",
        description:
          "Sesion ya realizada. Sirve para mostrar el historico de scans y entradas redimidas.",
        coverUrl: "/covers/yoga.svg",
        location: "Estudio Aurora — Sala 1, Palermo",
        startsAt: days(-3),
        capacity: 15,
        priceCents: 4000,
      },
      {
        id: "l_pack5",
        type: "PACK",
        ownerId: aurora.id,
        title: "Pack 5 clases libres",
        description:
          "Acceso a 5 clases libres dentro del estudio. Un solo QR, valido para 5 escaneos. Vence en 60 dias.",
        coverUrl: "/covers/pack.svg",
        location: "Estudio Aurora — Todas las salas",
        startsAt: days(1),
        capacity: 100,
        priceCents: 19000,
        packSize: 5,
      },
      {
        id: "l_picnic",
        type: "EVENTO",
        ownerId: carla.id,
        title: "Picnic literario en el parque",
        description:
          "Llevamos un libro y una manta. Lectura compartida, mate y galletitas. Evento gratuito organizado por Carla.",
        coverUrl: "/covers/picnic.svg",
        location: "Parque Centenario",
        startsAt: days(5),
        capacity: 12,
        priceCents: 0,
      },
      {
        id: "l_charla",
        type: "EVENTO",
        ownerId: carla.id,
        title: "Charla abierta: viajes en bici",
        description:
          "Una hora de relatos y consejos para tus primeros viajes largos en bicicleta. Entrada libre.",
        coverUrl: "/covers/charla.svg",
        location: "Cafe del Centro",
        startsAt: days(6),
        capacity: 20,
        priceCents: 0,
      },
      {
        id: "l_taller_arte",
        type: "EVENTO",
        ownerId: carla.id,
        title: "Taller de acuarelas para principiantes",
        description:
          "Llevamos pinceles y papel. Ideal para arrancar con acuarelas. Cupo reducido para acompañar bien.",
        coverUrl: "/covers/picnic.svg",
        location: "Centro Cultural Norte",
        startsAt: days(8),
        capacity: 10,
        priceCents: 0,
      },
    ],
  });

  // Sample tickets for Carla (PARTICULAR) — cover all states so wallet is rich
  // 1) ACTIVE paid class
  await db.ticket.create({
    data: {
      code: randomUUID(),
      listingId: "l_yoga",
      holderId: carla.id,
      status: "ACTIVE",
      remainingUses: 1,
      paymentRef: "demo_pay_yoga",
    },
  });
  // 2) ACTIVE free event
  await db.ticket.create({
    data: {
      code: randomUUID(),
      listingId: "l_picnic",
      holderId: carla.id,
      status: "ACTIVE",
      remainingUses: 1,
    },
  });
  // 3) ACTIVE pack with multiple remaining uses
  await db.ticket.create({
    data: {
      code: randomUUID(),
      listingId: "l_pack5",
      holderId: carla.id,
      status: "ACTIVE",
      remainingUses: 5,
      paymentRef: "demo_pay_pack",
    },
  });
  // 4) REDEEMED past class with one OK scan, so empresa stats and history are non-empty
  const redeemed = await db.ticket.create({
    data: {
      code: randomUUID(),
      listingId: "l_yoga_past",
      holderId: carla.id,
      status: "REDEEMED",
      remainingUses: 0,
      paymentRef: "demo_pay_past",
    },
  });
  await db.scan.create({
    data: {
      ticketId: redeemed.id,
      scannedById: aurora.id,
      result: "OK",
    },
  });

  console.log(
    `Seed listo. Users: ${await db.user.count()}, Listings: ${await db.listing.count()}, Tickets: ${await db.ticket.count()}, Scans: ${await db.scan.count()}.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
