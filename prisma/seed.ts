import { PrismaClient } from "@prisma/client";
import { randomUUID } from "node:crypto";

const db = new PrismaClient();

async function main() {
  await db.scan.deleteMany();
  await db.ticket.deleteMany();
  await db.listing.deleteMany();
  await db.user.deleteMany();

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

  const julian = await db.user.create({
    data: {
      id: "u_visitante_julian",
      name: "Julian Soto",
      role: "VISITANTE",
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
    ],
  });

  // Pre-issue a sample free ticket so the wallet is not empty
  await db.ticket.create({
    data: {
      code: randomUUID(),
      listingId: "l_picnic",
      holderId: julian.id,
      status: "ACTIVE",
      remainingUses: 1,
    },
  });

  console.log("Seed listo. Listings:", await db.listing.count());
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
