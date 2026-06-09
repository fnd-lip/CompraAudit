// monta as classes visuais de cada estado conforme alertas/blockchain
export function montarClasseEstado(
  uf: string | null,
  ufsPermitidas: Set<string>,
  ufSelecionada: string | null,
  alertas: number,
  registradas: number,
): string {
  const classes = ["mapa-brasil__estado"];

  if (!uf || !ufsPermitidas.has(uf)) {
    classes.push("mapa-brasil__estado--desabilitado");
    return classes.join(" ");
  }

  if (ufSelecionada === uf) {
    classes.push("mapa-brasil__estado--selecionado");
  }

  if (registradas > 0 && alertas > 0) {
    classes.push("mapa-brasil__estado--misto");
    return classes.join(" ");
  }

  if (registradas > 0) {
    classes.push("mapa-brasil__estado--registrado");
    return classes.join(" ");
  }

  if (alertas > 0) {
    classes.push("mapa-brasil__estado--alerta");
    return classes.join(" ");
  }

  classes.push("mapa-brasil__estado--vazio");

  return classes.join(" ");
}