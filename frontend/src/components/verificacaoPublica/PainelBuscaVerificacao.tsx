import { Search } from "lucide-react";
import { Button } from "../ui/Button";

type PainelBuscaVerificacaoProps = {
  consulta: string;
  carregando: boolean;
  onConsultaChange: (valor: string) => void;
  onVerificar: () => void;
};

export function PainelBuscaVerificacao({
  consulta,
  carregando,
  onConsultaChange,
  onVerificar,
}: PainelBuscaVerificacaoProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          {/* exibe o ícone da consulta */}
          <Search className="h-5 w-5" />
        </div>

        <div>
          <h2 className="font-display text-xl font-extrabold text-slate-950">
            Consultar evidência pública
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Informe um identificador, ID ou hash para confrontar os dados.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        <input
          value={consulta}
          onChange={(evento) => onConsultaChange(evento.target.value)}
          placeholder="Ex: PNCP-2026-0001, hash ou ID da evidência"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
        />

        <Button
          type="button"
          onClick={onVerificar}
          disabled={carregando}
          className="md:min-w-47.5"
        >
          {/* exibe a ação de verificação */}
          {carregando ? "Verificando..." : "Verificar"}
        </Button>
      </div>
    </div>
  );
}