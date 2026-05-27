import { Database, FileCheck2, ShieldCheck } from "lucide-react";
import type { Evidencia } from "../../types/evidencia";

type ResumoHistoricoProps = {
  evidencias: Evidencia[];
};

export function ResumoHistorico({ evidencias }: ResumoHistoricoProps) {
  const total = evidencias.length;
  const registradas = evidencias.filter(
    (evidencia) => evidencia.status === "REGISTRADA"
  ).length;
  const comTransacao = evidencias.filter(
    (evidencia) => Boolean(evidencia.hashTransacao)
  ).length;

  return (
    <div className="grid gap-5 md:grid-cols-3">
      <CardResumo
        titulo="auditorias registradas"
        valor={String(total)}
        texto="evidências salvas no histórico"
        icone={<FileCheck2 className="h-5 w-5" />}
        cor="azul"
      />

      <CardResumo
        titulo="registros ativos"
        valor={String(registradas)}
        texto="assinaturas com status registrado"
        icone={<ShieldCheck className="h-5 w-5" />}
        cor="verde"
      />

      <CardResumo
        titulo="provas on-chain"
        valor={String(comTransacao)}
        texto="evidências com transação associada"
        icone={<Database className="h-5 w-5" />}
        cor="azul"
      />
    </div>
  );
}

type CardResumoProps = {
  titulo: string;
  valor: string;
  texto: string;
  icone: React.ReactNode;
  cor: "azul" | "verde";
};

function CardResumo({ titulo, valor, texto, icone, cor }: CardResumoProps) {
  const classeIcone =
    cor === "verde"
      ? "bg-emerald-50 text-emerald-600"
      : "bg-blue-50 text-blue-600";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {titulo}
          </p>

          <strong className="mt-4 block font-display text-4xl font-extrabold text-slate-950">
            {valor}
          </strong>
        </div>

        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${classeIcone}`}>
          {/* exibe o ícone do resumo */}
          {icone}
        </div>
      </div>

      <p className="mt-5 font-mono text-xs text-slate-500">{texto}</p>
    </div>
  );
}