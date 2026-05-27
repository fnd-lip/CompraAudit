import { useState } from "react";
import type { ResultadoVerificacaoPublica } from "../types/evidencia";
import { PageContainer } from "../components/ui/PageContainer";
import { PageHeader } from "../components/ui/PageHeader";
import { verificarEvidenciaCompleta } from "../services/evidenciasService";
import { PainelBuscaVerificacao } from "../components/verificacaoPublica/PainelBuscaVerificacao";
import { BannerResultadoVerificacao } from "../components/verificacaoPublica/BannerResultadoVerificacao";
import { CardsComparacaoVerificacao } from "../components/verificacaoPublica/CardsComparacaoVerificacao";
import { ExplicacaoVerificacao } from "../components/verificacaoPublica/ExplicacaoVerificacao";

export function PublicVerification() {
  const [consulta, setConsulta] = useState("");
  const [resultado, setResultado] =
    useState<ResultadoVerificacaoPublica | null>(null);
  const [verificado, setVerificado] = useState(false);
  const [carregando, setCarregando] = useState(false);

  async function verificar() {
    if (!consulta.trim()) {
      alert("Informe um identificador, ID ou hash da evidência.");
      return;
    }

    setCarregando(true);
    setVerificado(false);

    try {
      const resposta = await verificarEvidenciaCompleta(consulta.trim());
      setResultado(resposta);
    } catch {
      setResultado(null);
    } finally {
      setVerificado(true);
      setCarregando(false);
    }
  }

  return (
    <PageContainer className="space-y-8">
      <PageHeader
        titulo="Visão Geral e Confronto Criptográfico"
        descricao="Consulte uma evidência pública e compare o registro salvo, a prova on-chain e os dados atuais da fonte pública."
      />

      <PainelBuscaVerificacao
        consulta={consulta}
        carregando={carregando}
        onConsultaChange={setConsulta}
        onVerificar={verificar}
      />

      <div className="rounded-2xl bg-slate-950 p-8 text-white shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-3 inline-flex rounded bg-blue-500/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-blue-300">
              confronto criptográfico
            </p>

            <h2 className="font-display text-xl font-extrabold">
              Mecanismo de Provas: Off-Chain vs On-Chain
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
              A aplicação compara os dados salvos fora da blockchain com o hash
              registrado on-chain e com os dados consultados novamente na fonte
              pública.
            </p>
          </div>

          <div className="rounded-xl bg-emerald-500 px-5 py-3 font-bold text-white">
            {/* exibe o modo real da verificação */}
            Verificação real ativa
          </div>
        </div>
      </div>

      <BannerResultadoVerificacao
        resultado={resultado}
        verificado={verificado}
      />

      {resultado && <CardsComparacaoVerificacao resultado={resultado} />}

      <ExplicacaoVerificacao />
    </PageContainer>
  );
}