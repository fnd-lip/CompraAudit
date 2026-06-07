import { Search } from "lucide-react";
import { Button } from "../ui/Button";
import { SugestoesAuditoria } from "./SugestoesAuditoria";
import type { SugestaoAuditoria } from "../../api/pncpApi";

type PainelConsultaAuditoriaProps = {
  identificador: string;
  carregando: boolean;
  identificadorRegistrado?: string;
  onIdentificadorChange: (valor: string) => void;
  onConsultar: () => void;
  onSelecionarSugestao: (sugestao: SugestaoAuditoria) => void;
};

export function PainelConsultaAuditoria({
  identificador,
  carregando,
  identificadorRegistrado,
  onIdentificadorChange,
  onConsultar,
  onSelecionarSugestao,
}: PainelConsultaAuditoriaProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-5">
        <Search className="h-5 w-5 text-blue-600" />

        <h2 className="font-display text-lg font-extrabold text-slate-950">
          1. Consultar Contratação
        </h2>
      </div>

      <div className="space-y-5">
        <div>
          <label className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
            identificador da contratação
          </label>

          <input
            value={identificador}
            onChange={(evento) => onIdentificadorChange(evento.target.value)}
            placeholder="Ex: 10377679000196-1-000087/2026"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
          />
        </div>

        <div>
          <label className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
            fonte pública
          </label>

          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
            PNCP / dados oficiais de contratação
          </div>
        </div>

        <Button
          type="button"
          onClick={() => onConsultar()}
          disabled={carregando}
          className="w-full"
        >
          {carregando ? "Consultando..." : "Consultar Dados Oficiais"}
        </Button>

        {/* exibe sugestões preventivas baseadas em gatilhos de risco */}
        <SugestoesAuditoria
          onSelecionar={onSelecionarSugestao}
          identificadorRegistrado={identificadorRegistrado}
        />
      </div>
    </div>
  );
}
