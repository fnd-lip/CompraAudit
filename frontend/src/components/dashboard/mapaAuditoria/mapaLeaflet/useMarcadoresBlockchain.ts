import { useEffect, useState } from "react";
import type { Evidencia } from "../../../../types/evidencia";
import {
  municipioEhValido,
  obterLocalizacaoBaseEvidencia,
  ufEhValida,
} from "./extratoresLocalizacaoMapa";
import { geocodificarMunicipio } from "./geocodificadorMunicipio";
import type {
  MarcadorBlockchain,
  RegistroSemLocalizacao,
} from "./tiposMapaLeaflet";

// Hook responsável por transformar evidências on-chain em pontos do mapa.
// Ele evita pontos aleatórios: se não houver localização confiável, o registro
// entra na lista de "sem localização" e não é desenhado.
export function useMarcadoresBlockchain(evidenciasOnChain: Evidencia[]) {
  const [marcadores, setMarcadores] = useState<MarcadorBlockchain[]>([]);
  const [registrosSemLocalizacao, setRegistrosSemLocalizacao] = useState<
    RegistroSemLocalizacao[]
  >([]);
  const [carregandoMarcadores, setCarregandoMarcadores] = useState(false);

  useEffect(() => {
    let componenteAtivo = true;

    async function montarMarcadores() {
      setCarregandoMarcadores(true);

      const proximosMarcadores: MarcadorBlockchain[] = [];
      const proximosSemLocalizacao: RegistroSemLocalizacao[] = [];

      for (const evidencia of evidenciasOnChain) {
        const { uf, municipio, coordenadaDireta } =
          obterLocalizacaoBaseEvidencia(evidencia);

        if (!ufEhValida(uf)) {
          proximosSemLocalizacao.push({
            evidencia,
            uf,
            municipio,
            motivo: "UF não encontrada na evidência.",
          });

          continue;
        }

        if (!municipioEhValido(municipio)) {
          proximosSemLocalizacao.push({
            evidencia,
            uf,
            municipio,
            motivo: "Município não encontrado na evidência.",
          });

          continue;
        }

        if (coordenadaDireta) {
          proximosMarcadores.push({
            evidencia,
            uf,
            municipio,
            coordenada: coordenadaDireta,
            localizacaoAproximada: false,
          });

          continue;
        }

        const coordenadaMunicipio = await geocodificarMunicipio(municipio, uf);

        if (!coordenadaMunicipio) {
          proximosSemLocalizacao.push({
            evidencia,
            uf,
            municipio,
            motivo: "Não foi possível localizar coordenadas para o município.",
          });

          continue;
        }

        proximosMarcadores.push({
          evidencia,
          uf,
          municipio,
          coordenada: coordenadaMunicipio,
          localizacaoAproximada: true,
        });
      }

      if (!componenteAtivo) {
        return;
      }

      setMarcadores(proximosMarcadores);
      setRegistrosSemLocalizacao(proximosSemLocalizacao);
      setCarregandoMarcadores(false);
    }

    montarMarcadores();

    return () => {
      componenteAtivo = false;
    };
  }, [evidenciasOnChain]);

  return {
    marcadores,
    registrosSemLocalizacao,
    carregandoMarcadores,
  };
}