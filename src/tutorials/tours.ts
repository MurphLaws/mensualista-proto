export type Placement = "top" | "bottom" | "left" | "right" | "auto" | "center";

export type TourStep = {
  target?: string; // data-tour attribute value; omit for centered modal
  title: string;
  body: string;
  placement?: Placement;
  // If target is missing or not yet in DOM, we still show the step centered
};

export type Tour = {
  id: string;
  // Path matcher: either exact, prefix (ends with *), or regex
  match: string | RegExp;
  steps: TourStep[];
};

export const TOURS: Tour[] = [
  {
    id: "landing",
    match: "/",
    steps: [
      {
        title: "Tu rol vive en Ajustes",
        body:
          "Empresa o Particular. Cambialo desde el icono de Ajustes en la barra inferior — la app se adapta sola.",
        placement: "center",
      },
      {
        target: "landing.first-card",
        title: "Hace clic en una clase",
        body:
          "El producto se explica solo: abri un listing y segui el flujo. Las pantallas siguientes te van a guiar.",
        placement: "right",
      },
      {
        target: "landing.hero-cta",
        title: "O entra al catalogo completo",
        body: "Filtra por tipo, gratis o pagas. Tu siguiente paso esta a un clic.",
        placement: "bottom",
      },
    ],
  },
  {
    id: "visitor",
    match: "/explorar",
    steps: [
      {
        title: "Explora clases y eventos",
        body:
          "Aca ves todo el catalogo. Las clases pagas son de empresas, los eventos son creados por particulares.",
        placement: "center",
      },
      {
        target: "explorar.filters",
        title: "Filtros rapidos",
        body: "Filtra por tipo (Eventos, Clases, Packs) o por gratis vs paga.",
        placement: "bottom",
      },
      {
        target: "explorar.first-card",
        title: "Cada listing es una tarjeta",
        body:
          "Hace clic para ver detalles, capacidad y precio. Si es gratis te inscribis al toque, si es pago abre un checkout.",
        placement: "right",
      },
      {
        title: "Siempre a un clic",
        body:
          "La barra inferior tiene Explorar, Entradas, Eventos y Ajustes. Cambia de rol desde Ajustes para ver el panel de Empresa.",
        placement: "center",
      },
    ],
  },
  {
    id: "listing-detail",
    match: /^\/listings\/.+/,
    steps: [
      {
        target: "listing.cta",
        title: "Inscribirme o comprar",
        body:
          "Si el listing es gratis, te inscribimos y emitimos tu QR al instante. Si es pago, abrimos un checkout estilo Stripe (es de demo, no se cobra).",
        placement: "left",
      },
      {
        target: "listing.meta",
        title: "Detalles importantes",
        body: "Capacidad, fecha y ubicacion. La capacidad se actualiza en vivo cuando se inscriben.",
        placement: "right",
      },
    ],
  },
  {
    id: "wallet",
    match: "/mis-entradas",
    steps: [
      {
        title: "Tus entradas",
        body:
          "Aca aparecen todos los QRs que tenes. Cada uno te lleva a la pantalla del ticket donde se muestra el codigo.",
        placement: "center",
      },
      {
        target: "wallet.first-ticket",
        title: "Mostra el QR en la puerta",
        body:
          "La empresa lo escanea con su scanner. Si es un pack, vas a ver cuantos usos te quedan.",
        placement: "right",
      },
    ],
  },
  {
    id: "empresa",
    match: "/empresa",
    steps: [
      {
        title: "Panel de tu empresa",
        body:
          "Desde aqui publicas clases y packs y revisas que se vendio. La cuenta seed es Estudio Aurora.",
        placement: "center",
      },
      {
        target: "empresa.create",
        title: "Crear una clase o pack",
        body:
          "Definis titulo, capacidad, precio y, si es un pack, cuantos usos incluye. Se publica al instante.",
        placement: "bottom",
      },
      {
        target: "empresa.stats",
        title: "Tus numeros",
        body: "Listings activos, entradas emitidas y escaneos exitosos. Datos en vivo desde la base.",
        placement: "top",
      },
      {
        target: "empresa.scanner-link",
        title: "Acceso al scanner",
        body:
          "El scanner es la pantalla que vas a abrir en la entrada del estudio para validar QRs.",
        placement: "left",
      },
    ],
  },
  {
    id: "scanner",
    match: "/empresa/scanner",
    steps: [
      {
        title: "Scanner de QR",
        body:
          "Pone el QR del visitante frente a la camara. Si es valido, se marca como asistido y, si es un pack, se descuenta un uso.",
        placement: "center",
      },
      {
        target: "scanner.camera",
        title: "Camara en vivo",
        body:
          "Permite el acceso a la camara cuando el navegador lo pida. Se enciende automaticamente.",
        placement: "right",
      },
      {
        target: "scanner.manual",
        title: "Sin camara? Pega el codigo",
        body:
          "Si tu navegador no tiene camara o estas haciendo demo en una sola maquina, pega aca el codigo del ticket que ves debajo del QR.",
        placement: "top",
      },
      {
        target: "scanner.feed",
        title: "Historial reciente",
        body:
          "Ves los ultimos escaneos con su resultado: OK, duplicado, exhausto o invalido.",
        placement: "left",
      },
    ],
  },
  {
    id: "particular",
    match: "/particular",
    steps: [
      {
        title: "Eventos personales",
        body:
          "Como particular podes crear eventos gratuitos y compartirlos. La gente se inscribe y recibe su QR.",
        placement: "center",
      },
      {
        target: "particular.create",
        title: "Crear un evento",
        body:
          "Titulo, fecha, ubicacion, capacidad. Sin precio, los eventos de particulares son siempre gratis.",
        placement: "bottom",
      },
    ],
  },
  {
    id: "particular-new",
    match: "/particular/nuevo",
    steps: [
      {
        target: "particular-new.title",
        title: "Empieza por el titulo",
        body: "Que vas a hacer? Hace que sea claro y atractivo en 8 palabras o menos.",
        placement: "right",
      },
      {
        target: "particular-new.capacity",
        title: "Cupo del evento",
        body: "Cuando se llena, no se aceptan mas inscripciones. Lo podes editar despues.",
        placement: "right",
      },
    ],
  },
  {
    id: "empresa-new",
    match: "/empresa/nueva",
    steps: [
      {
        target: "empresa-new.type",
        title: "Tipo de listing",
        body: "Una clase suelta o un pack de N clases con un solo QR.",
        placement: "right",
      },
      {
        target: "empresa-new.price",
        title: "Precio",
        body:
          "En centavos de pesos. 0 lo deja gratis. El checkout es de demo, no se cobra plata real.",
        placement: "right",
      },
      {
        target: "empresa-new.packsize",
        title: "Tamano del pack",
        body: "Solo se usa si elegis Pack. Determina cuantas veces se puede escanear el mismo QR.",
        placement: "right",
      },
    ],
  },
  {
    id: "ticket",
    match: /^\/tickets\/.+/,
    steps: [
      {
        target: "ticket.qr",
        title: "Tu codigo QR",
        body:
          "Mostralo en la puerta. Para hacer demo en una sola maquina, copia el codigo de texto que esta debajo y pegalo en el scanner.",
        placement: "right",
      },
    ],
  },
  {
    id: "checkout",
    match: /^\/checkout\/.+/,
    steps: [
      {
        target: "checkout.card",
        title: "Pago de demo",
        body:
          "Esto imita Stripe Checkout. Cualquier numero de 16 digitos funciona; vacio falla a proposito.",
        placement: "right",
      },
    ],
  },
];

export function findTourForPath(path: string): Tour | undefined {
  return TOURS.find((t) => {
    if (typeof t.match === "string") {
      if (t.match === "/") return path === "/";
      return path === t.match || path.startsWith(t.match + "/");
    }
    return t.match.test(path);
  });
}
