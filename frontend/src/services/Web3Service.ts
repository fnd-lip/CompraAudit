import { BrowserProvider, Contract } from "ethers";
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

// garante que a carteira esta na rede sepolia 
export async function garantirRedeSepolia() {
  if (!window.ethereum) {
    throw new Error("MetaMask nao encontrada.");
  }

  const chainIdAtual = (await window.ethereum.request({
    method: "eth_chainId",
  })) as string;

  const chainIdSepoliaHex = `0x${SEPOLIA_CHAIN_ID.toString(16)}`;

  if (chainIdAtual !== chainIdSepoliaHex) {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainIdSepoliaHex }],
    });
  }
}

// registra o hash da evidencia no contrato
export async function registrarHashOnChain(
  fonte: string,
  identificador: string,
  hashDados: string
): Promise<string> {
  if (!window.ethereum) {
    throw new Error("MetaMask nao encontrada.");
  }

  if (!ENDERECO_CONTRATO) {
    throw new Error("Endereco do contrato nao configurado.");
  }

  await garantirRedeSepolia();

  const provider = new BrowserProvider(window.ethereum);
  const assinador = await provider.getSigner();

  const contrato = new Contract(
    ENDERECO_CONTRATO,
    REGISTRO_AUDITORIA_ABI,
    assinador
  );

  const transacao = await contrato.registrarEvidencia(
    fonte,
    identificador,
    hashDados
  );

  await transacao.wait();

  return transacao.hash;
}

// consulta uma evidencia registrada no contrato 
export async function consultarEvidenciaOnChain(identificador: string) {
  if (!window.ethereum) {
    throw new Error("MetaMask nao encontrada.");
  }

  if (!ENDERECO_CONTRATO) {
    throw new Error("Endereco do contrato nao configurado.");
  }

  const provider = new BrowserProvider(window.ethereum);

  const contrato = new Contract(
    ENDERECO_CONTRATO,
    REGISTRO_AUDITORIA_ABI,
    provider
  );

  return contrato.consultarEvidencia(identificador);
}