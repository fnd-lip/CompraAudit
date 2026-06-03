import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Contratacao } from "../types/contratacao";
import type { SugestaoAuditoria } from "../api/pncpApi";
import { PageContainer } from "../components/ui/PageContainer";
import { PageHeader } from "../components/ui/PageHeader";
import {
  buscarContratacaoPorIdentificador,
  gerarHashDeContratacao,
} from "../services/pncpService";
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
  const [identificadorRegistrado, setIdentificadorRegistrado] = useState("");
  const [contratacao, setContratacao] = useState<Contratacao | null>(null);
  const [hashDados, setHashDados] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [registrando, setRegistrando] = useState(false);

  async function consultarContratacao(identificadorInformado = identificador) {
    const identificadorConsulta = identificadorInformado.trim();

    if (!identificadorConsulta) {
      alert("Informe o identificador da contratação.");
      return;
    }

    setCarregando(true);

    try {
      const resposta = await buscarContratacaoPorIdentificador(
        identificadorConsulta,
      );

      setIdentificador(identificadorConsulta);
      setContratacao(resposta.contratacao);
      setHashDados(resposta.hashDados);
    } catch (erro) {
      alert(erro instanceof Error ? erro.message : "Erro ao consultar dados.");
    } finally {
      setCarregando(false);
    }
  }

  async function selecionarSugestaoAuditoria(sugestao: SugestaoAuditoria) {
    setCarregando(true);

    try {
      const resposta = await gerarHashDeContratacao({
        identificador: sugestao.identificador,
        orgao: sugestao.orgao,
        objeto: sugestao.objeto,
        valor: sugestao.valor,
        modalidade: sugestao.modalidade,
        dataPublicacao: sugestao.dataPublicacao,
        fonte: sugestao.fonte,
        dadosOriginais: sugestao.dadosOriginais,
      });

      setIdentificador(sugestao.identificador);
      setContratacao(resposta.contratacao);
      setHashDados(resposta.hashDados);
    } catch (erro) {
      alert(
        erro instanceof Error
          ? erro.message
          : "Erro ao selecionar sugestão de auditoria.",
      );
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
        hashDados,
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

      setIdentificadorRegistrado(contratacao.identificador);

      navegar(`/evidencias/${evidencia.id}`);
    } catch (erro) {
      alert(
        erro instanceof Error ? erro.message : "Erro ao registrar evidência.",
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
          identificadorRegistrado={identificadorRegistrado}
          onIdentificadorChange={setIdentificador}
          onConsultar={consultarContratacao}
          onSelecionarSugestao={selecionarSugestaoAuditoria}
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
