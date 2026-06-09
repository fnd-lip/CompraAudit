import { useEffect, useMemo, useState } from "react";
import type { Evidencia } from "../../../types/evidencia";
import {
  NOMES_UF,
  REGIAO_INICIAL,
  REGIOES,
  type RegiaoMapa,
} from "./constantesMapaAuditoria";
import type {
  RespostaSugestoesMapa,
  SugestaoMapaAuditoria,
} from "./tiposMapaAuditoria";
import { normalizarTextoBusca } from "./utils/textoMapaAuditoria";
import {
  obterUfDaEvidencia,
  obterUfDaSugestao,
} from "./utils/ufMapaAuditoria";
import { evidenciaEstaNaBlockchain } from "./utils/evidenciaMapaAuditoria";

// concentra os dados e os cálculos usados pelo mapa
export function useMapaAuditoria(evidencias: Evidencia[]) {
  const [sugestoes, setSugestoes] = useState<SugestaoMapaAuditoria[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [regiaoSelecionada, setRegiaoSelecionada] =
    useState<RegiaoMapa>(REGIAO_INICIAL);
  const [ufSelecionada, setUfSelecionada] = useState<string | null>(null);
  const [buscaUf, setBuscaUf] = useState("");

  useEffect(() => {
    async function carregarSugestoes() {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3333";

        const resposta = await fetch(
          `${apiUrl}/pncp/sugestoes-auditoria?valorMinimo=100000`,
        );

        if (!resposta.ok) {
          throw new Error("Não foi possível carregar os alertas PNCP.");
        }

        const dados = (await resposta.json()) as RespostaSugestoesMapa;

        setSugestoes(dados.sugestoes || []);
      } catch (erroCapturado) {
        setErro(
          erroCapturado instanceof Error
            ? erroCapturado.message
            : "Erro ao carregar mapa de auditoria.",
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarSugestoes();
  }, []);

  // conta alertas PNCP por UF
  const contagemAlertasPorUf = useMemo(() => {
    const contagem = new Map<string, number>();

    for (const sugestao of sugestoes) {
      const uf = obterUfDaSugestao(sugestao);

      if (uf === "NI") {
        continue;
      }

      contagem.set(uf, (contagem.get(uf) || 0) + 1);
    }

    return contagem;
  }, [sugestoes]);

  // filtra evidências que já possuem prova on-chain
  const evidenciasOnChain = useMemo(() => {
    return evidencias.filter((evidencia) =>
      evidenciaEstaNaBlockchain(evidencia),
    );
  }, [evidencias]);

  // conta evidências registradas na blockchain por UF
  const contagemRegistradasPorUf = useMemo(() => {
    const contagem = new Map<string, number>();

    for (const evidencia of evidenciasOnChain) {
      const uf = obterUfDaEvidencia(evidencia);

      if (uf === "NI") {
        continue;
      }

      contagem.set(uf, (contagem.get(uf) || 0) + 1);
    }

    return contagem;
  }, [evidenciasOnChain]);

  // aplica filtro por região e busca textual
  const ufsExibidas = useMemo(() => {
    const termo = normalizarTextoBusca(buscaUf);

    return REGIOES[regiaoSelecionada].filter((uf) => {
      if (!termo) {
        return true;
      }

      return (
        normalizarTextoBusca(uf).includes(termo) ||
        normalizarTextoBusca(NOMES_UF[uf]).includes(termo)
      );
    });
  }, [buscaUf, regiaoSelecionada]);

  const alertasDaUf = useMemo(() => {
    if (!ufSelecionada) {
      return [];
    }

    return sugestoes.filter((sugestao) => {
      return obterUfDaSugestao(sugestao) === ufSelecionada;
    });
  }, [sugestoes, ufSelecionada]);

  const evidenciasDaUf = useMemo(() => {
    if (!ufSelecionada) {
      return [];
    }

    return evidenciasOnChain.filter((evidencia) => {
      return obterUfDaEvidencia(evidencia) === ufSelecionada;
    });
  }, [evidenciasOnChain, ufSelecionada]);

  function contarRegiao(regiao: RegiaoMapa): number {
    return REGIOES[regiao].reduce((total, uf) => {
      return (
        total +
        (contagemAlertasPorUf.get(uf) || 0) +
        (contagemRegistradasPorUf.get(uf) || 0)
      );
    }, 0);
  }

  function selecionarRegiao(regiao: RegiaoMapa) {
    setRegiaoSelecionada(regiao);
    setUfSelecionada(null);
  }

  return {
    sugestoes,
    evidenciasOnChain,
    carregando,
    erro,
    regiaoSelecionada,
    ufSelecionada,
    buscaUf,
    contagemAlertasPorUf,
    contagemRegistradasPorUf,
    ufsExibidas,
    alertasDaUf,
    evidenciasDaUf,
    setBuscaUf,
    setUfSelecionada,
    selecionarRegiao,
    contarRegiao,
  };
}
