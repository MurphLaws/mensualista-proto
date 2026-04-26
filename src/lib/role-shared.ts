// Shared between server and client. No `next/headers`, no Prisma.
export type Role = "PARTICULAR" | "EMPRESA";

export const ROLE_TO_USER_ID: Record<Role, string> = {
  EMPRESA: "u_empresa_aurora",
  PARTICULAR: "u_particular_carla",
};

export const ROLE_LABEL: Record<Role, string> = {
  EMPRESA: "Empresa",
  PARTICULAR: "Particular",
};

export const ROLE_SUBTITLE: Record<Role, string> = {
  EMPRESA: "Estudio Aurora",
  PARTICULAR: "Carla Mendez",
};
