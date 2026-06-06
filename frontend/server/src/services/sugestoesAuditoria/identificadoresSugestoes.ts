// normaliza identificadores antes de comparar com o Prisma
export function normalizarIdentificador(identificador: string): string {
  return identificador.trim();
}

// remove identificadores duplicados antes de consultar o banco
export function removerIdentificadoresDuplicados(
  identificadores: string[],
): string[] {
  return [
    ...new Set(
      identificadores
        .map((identificador) => normalizarIdentificador(identificador))
        .filter(Boolean),
    ),
  ];
}