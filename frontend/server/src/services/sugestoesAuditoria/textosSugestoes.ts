import type { Contratacao } from "../../types";

// junta partes de texto garantindo espaço entre elas
function juntarTexto(...partes: string[]): string {
  return partes
    .map((parte) => parte.trim())
    .filter(Boolean)
    .join(" ");
}

// cria a justificativa exibida no feed de sugestões
export function criarMotivoRisco(
  contratacao: Contratacao,
  valorMinimo: number,
): string {
  const valorFormatado = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valorMinimo);

  return juntarTexto(
    contratacao.modalidade,
    "acima de",
    valorFormatado,
    "ainda sem evidência criptográfica.",
  );
}