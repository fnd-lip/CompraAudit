import { BrowserProvider, Contract } from "ethers";
import { ENDERECO_CONTRATO } from "./contracts";
import { REGISTRO_AUDITORIA_ABI } from "./abi";

export async function conectarCarteiraWeb3(): Promise<string> {
  if (!window.ethereum) {
    throw new Error("MetaMask não encontrada.");
  }

  const contas = (await window.ethereum.request({
    method: "eth_requestAccounts",
  })) as string[];

  return contas[0];
}

export async function registrarHashOnChain(
  fonte: string,
  identificador: string,
  hashDados: string
): Promise<string> {
  if (!window.ethereum) {
    throw new Error("MetaMask não encontrada.");
  }

  if (!ENDERECO_CONTRATO) {
    throw new Error("Endereço do contrato não configurado.");
  }

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