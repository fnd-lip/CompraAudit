import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Contratacao } from "../types/contratacao";
import { PageContainer } from "../components/ui/PageContainer";
import { PageHeader } from "../components/ui/PageHeader";
import { buscarContratacaoPorIdentificador } from "../services/pncpService";
import { salvarEvidencia } from "../services/evidenciasService";
import { registrarHashOnChain } from "../services/Web3Service";
import { ENDERECO_CONTRATO } from "../services/contracts";
import { useWallet } from "../hooks/useWallet";
import { PainelConsultaAuditoria } from "../components/novaAuditoria/PainelConsultaAuditoria";
import { EtapasAuditoria } from "../components/novaAuditoria/EtapasAuditoria";
import { EstadoConsultaAuditoria } from "../components/novaAuditoria/EstadoConsultaAuditoria";
import { ResultadoContratacaoAuditoria } from "../components/novaAuditoria/ResultadoContratacaoAuditoria";

export function NewAudit() {
  const navegar = useNavigate();
  const { carteiraConectada, enderecoCarteira, conectarCarteira } = useWallet();

  const [identificador, setIdentificador] = useState("");
  const [contratacao, setContratacao] = useState<Contratacao | null>(null);
  const [hashDados, setHashDados] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [registrando, setRegistrando] = useState(false);

  async function consultarContratacao() {
    if (!identificador.trim()) {
      alert("Informe o identificador da contratação.");
      return;
    }

    setCarregando(true);

    try {
      const resposta = await buscarContratacaoPorIdentificador(
        identificador.trim()
      );

      setContratacao(resposta.contratacao);
      setHashDados(resposta.hashDados);
    } catch (erro) {
      alert(erro instanceof Error ? erro.message : "Erro ao consultar dados.");
    } finally {
      setCarregando(false);
    }
  }

  async function registrarEvidencia() {
    if (!contratacao || !hashDados) {
      alert("Consulte uma contratação antes de registrar.");
      return;
    }

    setRegistrando(true);

    try {
      if (!carteiraConectada) {
        await conectarCarteira();
      }

      const hashTransacao = await registrarHashOnChain(
        contratacao.fonte,
        contratacao.identificador,
        hashDados
      );

      const evidencia = await salvarEvidencia({
        identificador: contratacao.identificador,
        hashDados,
        hashTransacao,
        enderecoContrato: ENDERECO_CONTRATO,
        carteiraRegistradora: enderecoCarteira,
        status: "REGISTRADA",
        contratacao,
      });

      navegar(`/evidencias/${evidencia.id}`);
    } catch (erro) {
      alert(
        erro instanceof Error
          ? erro.message
          : "Erro ao registrar evidência."
      );
    } finally {
      setRegistrando(false);
    }
  }

  return (
    <PageContainer className="space-y-8">
      <PageHeader
        titulo="Iniciar Nova Auditoria Criptográfica"
        descricao="Consulte dados oficiais, gere uma impressão digital da contratação e registre a prova na blockchain."
      />

      <div className="grid gap-8 lg:grid-cols-[390px_1fr]">
        <PainelConsultaAuditoria
          identificador={identificador}
          carregando={carregando}
          onIdentificadorChange={setIdentificador}
          onConsultar={consultarContratacao}
        />

        <div className="space-y-6">
          <EtapasAuditoria
            temContratacao={Boolean(contratacao)}
            temHash={Boolean(hashDados)}
            registrando={registrando}
          />

          {!contratacao ? (
            <EstadoConsultaAuditoria />
          ) : (
            <ResultadoContratacaoAuditoria
              contratacao={contratacao}
              hashDados={hashDados}
              registrando={registrando}
              onRegistrar={registrarEvidencia}
            />
          )}
        </div>
      </div>
    </PageContainer>
  );
}