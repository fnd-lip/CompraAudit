import { useState } from "react";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { buscarSugestoesAuditoria } from "../../services/pncpService";
import { formatarMoeda } from "../../utils/formatCurrency";
import type { SugestaoAuditoria } from "../../api/pncpApi";

type SugestoesAuditoriaProps = {
  onSelecionar: (sugestao: SugestaoAuditoria) => void;
  identificadorRegistrado?: string;
};

export function SugestoesAuditoria({
  onSelecionar,
  identificadorRegistrado,
}: SugestoesAuditoriaProps) {
  const [sugestoes, setSugestoes] = useState<SugestaoAuditoria[]>([]);
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const sugestoesVisiveis = sugestoes.filter((sugestao) => {
    return sugestao.identificador !== identificadorRegistrado;
  });

  const totalSugestoes = sugestoesVisiveis.length;
  const possuiMaisDeUmaSugestao = totalSugestoes > 1;
  const indiceSeguro =
    totalSugestoes === 0 ? 0 : Math.min(indiceAtual, totalSugestoes - 1);
  const sugestaoAtual = sugestoesVisiveis[indiceSeguro];

  async function carregarSugestoes() {
    setCarregando(true);
    setErro("");

    try {
      const resposta = await buscarSugestoesAuditoria(100000);

      setSugestoes(resposta.sugestoes);
      setIndiceAtual(0);
    } catch (erro) {
      setErro(
        erro instanceof Error
          ? erro.message
          : "Erro ao buscar sugestões de auditoria."
      );
    } finally {
      setCarregando(false);
    }
  }

  function voltarSugestao() {
    setIndiceAtual((indice) => {
      if (indice === 0) {
        return totalSugestoes - 1;
      }

      return indice - 1;
    });
  }

  function avancarSugestao() {
    setIndiceAtual((indice) => {
      if (indice >= totalSugestoes - 1) {
        return 0;
      }

      return indice + 1;
    });
  }

  return (
    <div className="border-t border-slate-100 pt-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
            auditoria preventiva
          </p>

          <h3 className="mt-1 text-sm font-bold text-slate-900">
            Sugestões de Auditoria
          </h3>
        </div>

        <button
          type="button"
          onClick={carregarSugestoes}
          disabled={carregando}
          className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 transition hover:bg-amber-100 disabled:opacity-60"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          {carregando ? "Buscando..." : "Buscar"}
        </button>
      </div>

      <p className="mb-4 text-xs leading-5 text-slate-500">
        Contratações recentes de alto risco que ainda não possuem evidência
        criptográfica.
      </p>

      {erro && (
        <div className="mb-3 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
          {erro}
        </div>
      )}

      {!carregando && totalSugestoes === 0 && !erro && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-5 text-slate-500">
          Clique em <strong>Buscar</strong> para carregar sugestões de auditoria
          preventiva com base nos gatilhos de risco.
        </div>
      )}

      {sugestaoAtual && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-amber-700">
              <AlertTriangle className="h-4 w-4" />

              <span className="font-mono text-[10px] font-bold uppercase tracking-widest">
                risco alto
              </span>
            </div>

            <span className="rounded-full border border-amber-200 bg-white px-2 py-1 font-mono text-[10px] font-bold text-amber-700">
              {indiceSeguro + 1}/{totalSugestoes}
            </span>
          </div>

          <p className="text-xs font-bold text-slate-950">
            {sugestaoAtual.modalidade} · {formatarMoeda(sugestaoAtual.valor)}
          </p>

          <p className="mt-2 line-clamp-2 text-xs font-semibold leading-5 text-slate-700">
            {sugestaoAtual.orgao}
          </p>

          <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-500">
            {sugestaoAtual.objeto}
          </p>

          <p className="mt-3 text-[11px] font-semibold leading-5 text-amber-700">
            {sugestaoAtual.motivoRisco}
          </p>

          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={voltarSugestao}
              disabled={!possuiMaisDeUmaSugestao}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-amber-200 bg-white text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Sugestão anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => onSelecionar(sugestaoAtual)}
              className="min-w-0 flex-1 rounded-lg bg-slate-950 px-3 py-2 text-xs font-bold text-white transition hover:bg-slate-800"
            >
              Auditar agora
            </button>

            <button
              type="button"
              onClick={avancarSugestao}
              disabled={!possuiMaisDeUmaSugestao}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-amber-200 bg-white text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Próxima sugestão"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {possuiMaisDeUmaSugestao && (
            <div className="mt-3 flex justify-center gap-1.5">
              {sugestoesVisiveis.map((sugestao, indice) => (
                <button
                  key={sugestao.identificador}
                  type="button"
                  onClick={() => setIndiceAtual(indice)}
                  className={`h-2 w-2 rounded-full transition ${
                    indice === indiceSeguro ? "bg-amber-600" : "bg-amber-200"
                  }`}
                  aria-label={`Ir para sugestão ${indice + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}