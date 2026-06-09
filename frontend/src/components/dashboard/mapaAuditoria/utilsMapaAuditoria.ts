import type {
  DadosOriginaisPncp,
  SugestaoMapaAuditoria,
} from "./tiposMapaAuditoria";

export function obterUfDaSugestao(sugestao: SugestaoMapaAuditoria): string {
  const dadosOriginais = sugestao.dadosOriginais as
    | DadosOriginaisPncp
    | undefined;

  return dadosOriginais?.unidadeOrgao?.ufSigla?.toUpperCase() || "NI";
}

export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

export function classeRiscoPorQuantidade(quantidade: number): string {
  if (quantidade >= 2) {
    return "border-amber-300 bg-amber-50 text-amber-800 shadow-amber-100";
  }

  if (quantidade === 1) {
    return "border-emerald-300 bg-emerald-50 text-emerald-800 shadow-emerald-100";
  }

  return "border-slate-200 bg-slate-50 text-slate-400";
}

export function rotuloRiscoPorQuantidade(quantidade: number): string {
  if (quantidade >= 2) {
    return "Divergência crítica";
  }

  if (quantidade === 1) {
    return "Auditoria pendente";
  }

  return "Sem sugestões";
}