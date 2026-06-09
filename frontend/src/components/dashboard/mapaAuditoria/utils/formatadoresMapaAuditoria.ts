// formata valores monetários dos alertas PNCP
export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

// define o texto do painel lateral conforme os dados da UF
export function rotuloRiscoPorQuantidade(
  alertas: number,
  registradas: number,
): string {
  if (registradas > 0 && alertas > 0) {
    return "Auditorias registradas e alertas PNCP";
  }

  if (registradas > 0) {
    return "Auditorias registradas na blockchain";
  }

  if (alertas > 0) {
    return "Alertas PNCP ativos";
  }

  return "Sem dados no recorte atual";
}