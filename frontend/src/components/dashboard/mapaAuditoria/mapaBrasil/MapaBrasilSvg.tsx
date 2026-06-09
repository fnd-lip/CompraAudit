import type { EstadoMapaRenderizado } from "../tiposMapaAuditoria";
import { ALTURA_MAPA, LARGURA_MAPA } from "./constantesMapaBrasil";
import { ESTILOS_MAPA_BRASIL } from "./estilosMapaBrasil";
import { montarClasseEstado } from "./classesMapaBrasil";

type MapaBrasilSvgProps = {
  estados: EstadoMapaRenderizado[];
  ufsPermitidas: Set<string>;
  contagemAlertasPorUf: Map<string, number>;
  contagemRegistradasPorUf: Map<string, number>;
  ufSelecionada: string | null;
  onSelecionarUf: (uf: string) => void;
};

// renderiza o SVG final com os estados clicáveis
export function MapaBrasilSvg({
  estados,
  ufsPermitidas,
  contagemAlertasPorUf,
  contagemRegistradasPorUf,
  ufSelecionada,
  onSelecionarUf,
}: MapaBrasilSvgProps) {
  return (
    <>
      <style>{ESTILOS_MAPA_BRASIL}</style>

      <svg
        className="mapa-brasil"
        viewBox={`0 0 ${LARGURA_MAPA} ${ALTURA_MAPA}`}
        role="img"
        aria-label="Mapa do Brasil por Unidade Federativa"
      >
        {estados.map((estado) => {
          const alertas = estado.uf
            ? contagemAlertasPorUf.get(estado.uf) || 0
            : 0;

          const registradas = estado.uf
            ? contagemRegistradasPorUf.get(estado.uf) || 0
            : 0;

          return (
            <path
              key={`${estado.uf || estado.nome}-${estado.caminho.slice(0, 12)}`}
              d={estado.caminho}
              fillRule="evenodd"
              className={montarClasseEstado(
                estado.uf,
                ufsPermitidas,
                ufSelecionada,
                alertas,
                registradas,
              )}
              role="button"
              tabIndex={estado.uf && ufsPermitidas.has(estado.uf) ? 0 : -1}
              aria-label={`${estado.nome}: ${alertas} alerta(s), ${registradas} registro(s) na blockchain`}
              onClick={() => {
                if (!estado.uf || !ufsPermitidas.has(estado.uf)) {
                  return;
                }

                onSelecionarUf(estado.uf);
              }}
              onKeyDown={(evento) => {
                if (evento.key !== "Enter" && evento.key !== " ") {
                  return;
                }

                if (!estado.uf || !ufsPermitidas.has(estado.uf)) {
                  return;
                }

                onSelecionarUf(estado.uf);
              }}
            >
              <title>
                {estado.nome}
                {estado.uf ? ` (${estado.uf})` : ""}: {alertas} alerta(s),{" "}
                {registradas} registro(s) na blockchain
              </title>
            </path>
          );
        })}
      </svg>
    </>
  );
}