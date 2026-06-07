import {
  BrowserProvider,
  Contract,
  ZeroAddress,
  type Eip1193Provider,
} from "ethers";
import { REGISTRO_AUDITORIA_ABI } from "./abi";
import { ENDERECO_CONTRATO, SEPOLIA_CHAIN_ID } from "./contracts";

// conecta a carteira metamask
export async function conectarCarteiraWeb3(): Promise<string> {
  if (!window.ethereum) {
    throw new Error("MetaMask nao encontrada.");
  }

  const contas = (await window.ethereum.request({
    method: "eth_requestAccounts",
  })) as string[];

  return contas[0];
}

// recupera o provider da MetaMask já validado para o .TS
function obterEthereumProvider(): Eip1193Provider {
  const ethereum = window.ethereum;

  if (!ethereum) {
    throw new Error("MetaMask nao encontrada.");
  }

  if (!ENDERECO_CONTRATO) {
    throw new Error("Endereco do contrato nao configurado.");
  }

  return ethereum as Eip1193Provider;
}

// garante que a carteira esta na rede sepolia
export async function garantirRedeSepolia() {
  const ethereum = obterEthereumProvider();

  const chainIdAtual = (await ethereum.request({
    method: "eth_chainId",
  })) as string;

  const chainIdSepoliaHex = `0x${SEPOLIA_CHAIN_ID.toString(16)}`;

  if (chainIdAtual !== chainIdSepoliaHex) {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainIdSepoliaHex }],
    });
  }
}

// cria contrato somente para leitura
async function criarContratoLeitura() {
  const ethereum = obterEthereumProvider();

  await garantirRedeSepolia();

  const provider = new BrowserProvider(ethereum);

  return new Contract(
    ENDERECO_CONTRATO,
    REGISTRO_AUDITORIA_ABI,
    provider,
  );
}

// cria contrato para escrita/transacao
async function criarContratoEscrita() {
  const ethereum = obterEthereumProvider();

  await garantirRedeSepolia();

  const provider = new BrowserProvider(ethereum);
  const assinador = await provider.getSigner();

  return new Contract(
    ENDERECO_CONTRATO,
    REGISTRO_AUDITORIA_ABI,
    assinador,
  );
}

// extrai mensagem de erro de forma segura
function extrairTextoErro(erro: unknown): string {
  if (erro instanceof Error) {
    return erro.message;
  }

  if (typeof erro === "string") {
    return erro;
  }

  try {
    return JSON.stringify(erro);
  } catch {
    return "";
  }
}

// identifica erro bruto vindo da blockchain quando a evidência já existe
export function ehErroEvidenciaJaRegistrada(erro: unknown): boolean {
  const mensagem = extrairTextoErro(erro).toLowerCase();

  return (
    mensagem.includes("evidencia ja registrada") ||
    mensagem.includes("evidência já registrada")
  );
}

// verifica se um valor retornado pelo contrato parece preenchido
function valorOnChainPreenchido(valor: unknown): boolean {
  if (typeof valor === "bigint") {
    return valor > 0n;
  }

  if (typeof valor === "number") {
    return valor > 0;
  }

  if (typeof valor !== "string") {
    return false;
  }

  const texto = valor.trim();

  if (!texto) {
    return false;
  }

  if (texto.toLowerCase() === ZeroAddress.toLowerCase()) {
    return false;
  }

  if (/^0x0{64}$/i.test(texto)) {
    return false;
  }

  return true;
}

// interpreta o retorno da consulta on-chain
function evidenciaOnChainExiste(evidencia: unknown): boolean {
  if (!evidencia) {
    return false;
  }

  if (Array.isArray(evidencia)) {
    return evidencia.some((valor) => valorOnChainPreenchido(valor));
  }

  if (typeof evidencia === "object") {
    return Object.values(evidencia as Record<string, unknown>).some((valor) =>
      valorOnChainPreenchido(valor),
    );
  }

  return valorOnChainPreenchido(evidencia);
}

// consulta se a evidência já existe antes de tentar registrar novamente
export async function verificarEvidenciaJaRegistradaOnChain(
  identificador: string,
): Promise<boolean> {
  const contrato = await criarContratoLeitura();

  try {
    const evidencia = await contrato.consultarEvidencia(identificador);

    return evidenciaOnChainExiste(evidencia);
  } catch {
    return false;
  }
}

// registra o hash da evidencia no contrato
export async function registrarHashOnChain(
  fonte: string,
  identificador: string,
  hashDados: string,
): Promise<string> {
  const contrato = await criarContratoEscrita();

  const transacao = await contrato.registrarEvidencia(
    fonte,
    identificador,
    hashDados,
  );

  await transacao.wait();

  return transacao.hash;
}

// consulta uma evidencia registrada no contrato
export async function consultarEvidenciaOnChain(identificador: string) {
  const contrato = await criarContratoLeitura();

  return contrato.consultarEvidencia(identificador);
}