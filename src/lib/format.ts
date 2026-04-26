export function formatPrice(cents: number): string {
  if (cents <= 0) return "Gratis";
  const value = cents / 100;
  return value.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("es-AR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatType(type: string): string {
  switch (type) {
    case "EVENTO":
      return "Evento";
    case "CLASE":
      return "Clase";
    case "PACK":
      return "Pack";
    default:
      return type;
  }
}
