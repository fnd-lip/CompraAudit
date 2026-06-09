import type { Evidencia } from "../../../types/evidencia";
import { MapaRegistrosBlockchain } from "./mapaLeaflet/MapaRegistrosBlockchain";
import { useMapaAuditoria } from "./useMapaAuditoria";

type MapaAuditoriaBrasilProps = {
  evidencias: Evidencia[];
};

export function MapaAuditoriaBrasil({ evidencias }: MapaAuditoriaBrasilProps) {
  const {
    sugestoes,
    evidenciasOnChain,
    carregando,
    erro,
  } = useMapaAuditoria(evidencias);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
            painel territorial de auditoria
          </p>

          <h2 className="mt-1 font-display text-xl font-extrabold text-slate-950">
            Mapa de Registros On-chain
          </h2>

          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Visualize no mapa os contratos/evidências que já foram registrados
            na blockchain. Cada ponto azul representa uma evidência on-chain.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-amber-600">
              alertas PNCP
            </p>

            <p className="text-2xl font-black text-amber-900">
              {sugestoes.length}
            </p>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-blue-600">
              blockchain
            </p>

            <p className="text-2xl font-black text-blue-950">
              {evidenciasOnChain.length}
            </p>
          </div>
        </div>
      </div>

      {carregando ? (
        <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
          Carregando mapa de registros on-chain...
        </div>
      ) : erro ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {erro}
        </div>
      ) : (
        // Mapa real com os registros da blockchain desenhados como pontos clicáveis.
        // Não usamos mais cards laterais fixos: os detalhes aparecem no popup do ponto.
        <MapaRegistrosBlockchain evidenciasOnChain={evidenciasOnChain} />
      )}
    </section>
  );
}