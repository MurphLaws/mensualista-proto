// Shared between server and client. No `next/headers`, no Prisma.
export type Role = "PARTICULAR" | "EMPRESA" | "VISITANTE";

export const ROLE_TO_USER_ID: Record<Role, string> = {
  EMPRESA: "u_empresa_aurora",
  PARTICULAR: "u_particular_carla",
  VISITANTE: "u_visitante_julian",
};

export const ROLE_LABEL: Record<Role, string> = {
  EMPRESA: "Empresa",
  PARTICULAR: "Particular",
  VISITANTE: "Visitante",
};

export const ROLE_SUBTITLE: Record<Role, string> = {
  EMPRESA: "Estudio Aurora",
  PARTICULAR: "Carla Mendez",
  VISITANTE: "Julian Soto",
};
