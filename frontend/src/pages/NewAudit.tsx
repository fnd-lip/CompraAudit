import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Contratacao } from "../types/contratacao";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { HashBlock } from "../components/evidencias/HashBlock";
import { useWallet } from "../hooks/useWallet";
import { buscarContratacaoPorIdentificador } from "../services/pncpService";
import { salvarEvidencia } from "../services/evidenciasService";
import { registrarHashOnChain } from "../services/Web3Service";
import { ENDERECO_CONTRATO } from "../services/contracts";
import { formatarMoeda } from "../utils/formatCurrency";

export function NewAudit() {
  const navegar = useNavigate();
  const { enderecoCarteira, carteiraConectada, conectarCarteira } = useWallet();

  const [identificador, setIdentificador] = useState("");
  const [contratacao, setContratacao] = useState<Contratacao | null>(null);
  const [hashDados, setHashDados] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [registrando, setRegistrando] = useState(false);

  // consulta a contratacao no backend
  async function consultarContratacao() {
    if (!identificador.trim()) {
      alert("Informe o identificador da contratação.");
      return;
    }

    setCarregando(true);

    try {
      const resposta = await buscarContratacaoPorIdentificador(identificador);

      setContratacao(resposta.contratacao);
      setHashDados(resposta.hashDados);
    } catch (erro) {
      alert(erro instanceof Error ? erro.message : "Erro ao consultar dados.");
    } finally {
      setCarregando(false);
    }
  }

  // registra a evidencia na blockchain e salva no backend 
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
    <div>
      <h1 className="text-3xl font-bold text-slate-950">Nova Auditoria</h1>

      <p className="mt-2 text-slate-600">
        Consulte uma contratação pública, registre o hash na Sepolia e salve a
        evidência off-chain.
      </p>

      <Card className="mt-8">
        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
          Identificador da contratação
        </label>

        <div className="mt-3 flex gap-3">
          <input
            value={identificador}
            onChange={(evento) => setIdentificador(evento.target.value)}
            className="flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
            placeholder="Ex: PNCP-2026-0001"
          />

          <Button type="button" onClick={consultarContratacao}>
            {carregando ? "Consultando..." : "Consultar"}
          </Button>
        </div>
      </Card>

      {contratacao && (
        <Card className="mt-6">
          <h2 className="text-xl font-bold">Dados da contratação</h2>

          <div className="mt-4 grid gap-3 text-sm text-slate-700">
            <p>Órgão: {contratacao.orgao}</p>
            <p>Objeto: {contratacao.objeto}</p>
            <p>Valor: {formatarMoeda(contratacao.valor)}</p>
            <p>Modalidade: {contratacao.modalidade}</p>
            <p>Fonte: {contratacao.fonte}</p>
          </div>

          <div className="mt-6">
            <HashBlock hash={hashDados} />
          </div>

          <div className="mt-6">
            <Button
              type="button"
              onClick={registrarEvidencia}
              disabled={registrando}
            >
              {registrando ? "Registrando..." : "Registrar na Blockchain"}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}