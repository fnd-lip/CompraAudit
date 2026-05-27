import { FileCheck2, ShieldCheck, Wallet } from "lucide-react";
import type { ReactNode } from "react";
import type { Evidencia } from "../../types/evidencia";
import { reduzirHash } from "../../utils/reduceHash";

type DashboardMetricasProps = {
  evidencias: Evidencia[];
  carteiraConectada: boolean;
  enderecoCarteira: string;
};

export function DashboardMetricas({
  evidencias,
  carteiraConectada,
  enderecoCarteira,
}: DashboardMetricasProps) {
  const total = evidencias.length;
  const registradas = evidencias.filter(
    (evidencia) => evidencia.status === "REGISTRADA"
  ).length;

  const confiabilidade =
    total === 0 ? 0 : Math.round((registradas / total) * 100);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <CardMetrica
        titulo="auditorias realizadas"
        valor={String(total)}
        descricao={`${registradas} registro${registradas === 1 ? "" : "s"} com prova ativa`}
        icone={<FileCheck2 className="h-5 w-5" />}
        variante="claro"
      />

      <CardMetrica
        titulo="índice de confiabilidade"
        valor={`${confiabilidade}%`}
        descricao={
          total === 0
            ? "sem evidências registradas ainda"
            : "baseado nas evidências registradas"
        }
        icone={<ShieldCheck className="h-5 w-5" />}
        variante="claro"
      />

      <div className="rounded-2xl bg-blue-600 p-6 text-white shadow-lg shadow-blue-600/20">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-blue-100">
              carteira metamask
            </p>

            <div className="mt-3 inline-flex rounded-md bg-white/10 px-3 py-1 font-mono text-xs font-bold text-white">
              {carteiraConectada
                ? reduzirHash(enderecoCarteira)
                : "não conectada"}
            </div>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
            {/* exibe o ícone da carteira */}
            <Wallet className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-7">
          <p className="text-xs font-semibold text-blue-100">Rede configurada</p>

          <p className="mt-1 font-display text-2xl font-extrabold">
            Sepolia
          </p>
        </div>
      </div>
    </div>
  );
}

type CardMetricaProps = {
  titulo: string;
  valor: string;
  descricao: string;
  icone: ReactNode;
  variante: "claro";
};

function CardMetrica({ titulo, valor, descricao, icone }: CardMetricaProps) {
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

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          {/* exibe o ícone da métrica */}
          {icone}
        </div>
      </div>

      <p className="mt-6 font-mono text-xs text-slate-500">{descricao}</p>
    </div>
  );
}