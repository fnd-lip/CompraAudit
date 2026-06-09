import { useEffect, useMemo, useState } from "react";
import {
  REGIAO_INICIAL,
  REGIOES,
  type RegiaoMapa,
} from "./constantesMapaAuditoria";
import type {
  RespostaSugestoesMapa,
  SugestaoMapaAuditoria,
} from "./tiposMapaAuditoria";
import { obterUfDaSugestao } from "./utilsMapaAuditoria";

export function useMapaAuditoria() {
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
          throw new Error("Não foi possível carregar o mapa de auditoria.");
        }

        const dados = (await resposta.json()) as RespostaSugestoesMapa;

        setSugestoes(dados.sugestoes);
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

  const contagemPorUf = useMemo(() => {
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

  const ufsExibidas = useMemo(() => {
    const termo = buscaUf.trim().toUpperCase();

    return REGIOES[regiaoSelecionada].filter((uf) => {
      if (!termo) {
        return true;
      }

      return uf.includes(termo);
    });
  }, [buscaUf, regiaoSelecionada]);

  const sugestoesDaUf = useMemo(() => {
    if (!ufSelecionada) {
      return [];
    }

    return sugestoes.filter((sugestao) => {
      return obterUfDaSugestao(sugestao) === ufSelecionada;
    });
  }, [sugestoes, ufSelecionada]);

  function contarRegiao(regiao: RegiaoMapa): number {
    return REGIOES[regiao].reduce((total, uf) => {
      return total + (contagemPorUf.get(uf) || 0);
    }, 0);
  }

  function selecionarRegiao(regiao: RegiaoMapa) {
    setRegiaoSelecionada(regiao);
    setUfSelecionada(null);
  }

  return {
    sugestoes,
    carregando,
    erro,
    regiaoSelecionada,
    ufSelecionada,
    buscaUf,
    contagemPorUf,
    ufsExibidas,
    sugestoesDaUf,
    setBuscaUf,
    setUfSelecionada,
    selecionarRegiao,
    contarRegiao,
  };
}
