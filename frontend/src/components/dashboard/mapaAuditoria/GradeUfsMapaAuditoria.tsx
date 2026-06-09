import { useEffect, useMemo, useState } from "react";
import { NOMES_UF } from "./constantesMapaAuditoria";
import type {
  BrasilGeoJson,
  EstadoMapaRenderizado,
} from "./tiposMapaAuditoria";
import { CAMINHO_GEOJSON_BRASIL } from "./mapaBrasil/constantesMapaBrasil";
import { montarEstadosRenderizados } from "./mapaBrasil/geometriaMapaBrasil";
import { MapaBrasilSvg } from "./mapaBrasil/MapaBrasilSvg";

type GradeUfsMapaAuditoriaProps = {
  ufsExibidas: readonly string[];
  contagemAlertasPorUf: Map<string, number>;
  contagemRegistradasPorUf: Map<string, number>;
  ufSelecionada: string | null;
  onSelecionarUf: (uf: string) => void;
};

// carrega o GeoJSON e exibe o mapa geográfico do Brasil
export function GradeUfsMapaAuditoria({
  ufsExibidas,
  contagemAlertasPorUf,
  contagemRegistradasPorUf,
  ufSelecionada,
  onSelecionarUf,
}: GradeUfsMapaAuditoriaProps) {
  const [estados, setEstados] = useState<EstadoMapaRenderizado[]>([]);
  const [erroMapa, setErroMapa] = useState("");

  const ufsPermitidas = useMemo(() => {
    return new Set(ufsExibidas);
  }, [ufsExibidas]);

  useEffect(() => {
    async function carregarMapaBrasil() {
      try {
        const resposta = await fetch(CAMINHO_GEOJSON_BRASIL);

        if (!resposta.ok) {
          throw new Error("Não foi possível carregar o mapa do Brasil.");
        }

        const geoJson = (await resposta.json()) as BrasilGeoJson;
        const estadosRenderizados = montarEstadosRenderizados(geoJson);

        setEstados(estadosRenderizados);
      } catch (erro) {
        setErroMapa(
          erro instanceof Error
            ? erro.message
            : "Erro ao carregar mapa do Brasil.",
        );
      }
    }

    carregarMapaBrasil();
  }, []);

  if (erroMapa) {
    return (
      <div className="rounded-3xl border border-red-100 bg-red-50 p-5 text-sm font-semibold text-red-700">
        {erroMapa}
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
            mapa nacional
          </p>

          <h3 className="font-display text-lg font-extrabold text-slate-950">
            Brasil por Unidade Federativa
          </h3>
        </div>

        {ufSelecionada && (
          <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-2 text-right">
            <p className="font-mono text-[10px] font-bold uppercase text-blue-500">
              selecionado
            </p>

            <p className="font-black text-blue-950">
              {ufSelecionada} — {NOMES_UF[ufSelecionada]}
            </p>
          </div>
        )}
      </div>

      {estados.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
          Carregando geometrias do mapa...
        </div>
      ) : (
        <MapaBrasilSvg
          estados={estados}
          ufsPermitidas={ufsPermitidas}
          contagemAlertasPorUf={contagemAlertasPorUf}
          contagemRegistradasPorUf={contagemRegistradasPorUf}
          ufSelecionada={ufSelecionada}
          onSelecionarUf={onSelecionarUf}
        />
      )}
    </div>
  );
}