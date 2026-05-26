import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Contratacao } from "../types/contratacao";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { HashBlock } from "../components/evidencias/HashBlock";
import { useWallet } from "../hooks/useWallet";
import { buscarContratacaoPorIdentificador } from "../services/pncpService";
import { gerarHashDosDados, prepararDadosParaHash } from "../services/hashService";
import { salvarEvidencia } from "../services/evidenciasService";
import { formatarMoeda } from "../utils/formatCurrency";

export function NewAudit() {
  const navegar = useNavigate();
  const { enderecoCarteira, carteiraConectada, conectarCarteira } = useWallet();

  const [identificador, setIdentificador] = useState("");
  const [contratacao, setContratacao] = useState<Contratacao | null>(null);
  const [hashGerado, setHashGerado] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function consultarContratacao() {
    if (!identificador) {
      alert("Informe o identificador da contratação.");
      return;
    }

    setCarregando(true);

    try {
      const dadosContratacao = await buscarContratacaoPorIdentificador(identificador);
      setContratacao(dadosContratacao);
      setHashGerado("");
    } finally {
      setCarregando(false);
    }
  }

  async function gerarHash() {
    if (!contratacao) return;

    const dadosParaHash = prepararDadosParaHash(contratacao);
    const novoHash = await gerarHashDosDados(dadosParaHash);

    setHashGerado(novoHash);
  }

  async function registrarEvidencia() {
    if (!contratacao || !hashGerado) {
      alert("Consulte a contratação e gere o hash antes de registrar.");
      return;
    }

    if (!carteiraConectada) {
      await conectarCarteira();
      return;
    }

    const novaEvidencia = salvarEvidencia({
      id: crypto.randomUUID(),
      identificador: contratacao.identificador,
      hashDados: hashGerado,
      hashTransacao: `0x${crypto.randomUUID().replaceAll("-", "")}`,
      carteiraRegistradora: enderecoCarteira,
      enderecoContrato: "Contrato Sepolia ainda não configurado",
      dataRegistro: new Date().toISOString(),
      status: "REGISTRADA",
      contratacao,
    });

    navegar(`/evidencias/${novaEvidencia.id}`);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-950">Nova Auditoria</h1>

      <p className="mt-2 text-slate-600">
        Consulte uma contratação pública e registre uma prova de integridade.
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

          <div className="mt-6 flex gap-3">
            <Button type="button" onClick={gerarHash}>
              Gerar Hash
            </Button>

            <Button type="button" onClick={registrarEvidencia} variante="secundario">
              Registrar Evidência
            </Button>
          </div>

          <div className="mt-6">
            <HashBlock hash={hashGerado} />
          </div>
        </Card>
      )}
    </div>
  );
}