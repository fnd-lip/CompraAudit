import { useEffect, useState, type ReactNode } from "react";
import { WalletContext } from "./WalletContextValue";

type WalletProviderProps = {
  children: ReactNode;
};

type EthereumProvider = {
  request: (args: {
    method: string;
    params?: unknown[] | Record<string, unknown>;
  }) => Promise<unknown>;
  on?: (evento: string, callback: (...args: unknown[]) => void) => void;
  removeListener?: (
    evento: string,
    callback: (...args: unknown[]) => void
  ) => void;
};

type ErroCarteira = {
  code?: number;
  message?: string;
};

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

const CHAVE_CARTEIRA = "compraaudit_carteira";

function obterEthereum() {
  return window.ethereum;
}

function obterCarteiraInicial() {
  /* busca a carteira salva antes de renderizar o contexto */
  return localStorage.getItem(CHAVE_CARTEIRA) ?? "";
}

function obterPrimeiraConta(resposta: unknown) {
  if (!Array.isArray(resposta)) {
    return "";
  }

  const primeiraConta = resposta[0];

  if (typeof primeiraConta !== "string") {
    return "";
  }

  return primeiraConta;
}

function obterMensagemErroCarteira(erro: unknown) {
  const erroCarteira = erro as ErroCarteira;

  if (erroCarteira.code === 4001) {
    return "Conexão cancelada pelo usuário.";
  }

  if (erroCarteira.code === -32002) {
    return "Já existe uma solicitação aberta na MetaMask. Verifique a janela da carteira.";
  }

  if (
    erroCarteira.message?.toLowerCase().includes("locked") ||
    erroCarteira.message?.toLowerCase().includes("unlock")
  ) {
    return "Desbloqueie a MetaMask e tente conectar novamente.";
  }

  return "Não foi possível conectar a carteira.";
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [enderecoCarteira, setEnderecoCarteira] =
    useState(obterCarteiraInicial);
  const [conectando, setConectando] = useState(false);

  const carteiraConectada = Boolean(enderecoCarteira);

  async function conectarCarteira() {
    const ethereum = obterEthereum();

    if (!ethereum) {
      alert("MetaMask não encontrada. Instale a extensão para continuar.");
      return;
    }

    setConectando(true);

    try {
      try {
        /* solicita permissão para acessar as contas da metamask */
        await ethereum.request({
          method: "wallet_requestPermissions",
          params: [
            {
              eth_accounts: {},
            },
          ],
        });
      } catch (erroPermissao) {
        const erroCarteira = erroPermissao as ErroCarteira;

        if (erroCarteira.code === 4001) {
          throw erroPermissao;
        }

        if (erroCarteira.code === -32002) {
          throw erroPermissao;
        }

        /* continua o fluxo caso a carteira não suporte esse método */
      }

      /* solicita as contas disponíveis após a permissão */
      const resposta = await ethereum.request({
        method: "eth_requestAccounts",
      });

      const conta = obterPrimeiraConta(resposta);

      if (!conta) {
        alert("Nenhuma carteira foi selecionada.");
        return;
      }

      setEnderecoCarteira(conta);
      localStorage.setItem(CHAVE_CARTEIRA, conta);
    } catch (erro) {
      console.error(erro);
      alert(obterMensagemErroCarteira(erro));
    } finally {
      setConectando(false);
    }
  }

  async function desconectarCarteira() {
    const ethereum = obterEthereum();

    setConectando(true);

    try {
      /* tenta remover a permissão da aplicação na metamask */
      await ethereum?.request({
        method: "wallet_revokePermissions",
        params: [
          {
            eth_accounts: {},
          },
        ],
      });
    } catch {
      /* algumas carteiras não permitem revogar permissão via código */
    } finally {
      /* limpa a carteira salva na aplicação */
      setEnderecoCarteira("");
      localStorage.removeItem(CHAVE_CARTEIRA);
      setConectando(false);
    }
  }

  useEffect(() => {
    const ethereum = obterEthereum();

    if (!ethereum?.on || !ethereum?.removeListener) {
      return;
    }

    function atualizarContas(...args: unknown[]) {
      const contas = args[0];
      const conta = obterPrimeiraConta(contas);

      if (!conta) {
        setEnderecoCarteira("");
        localStorage.removeItem(CHAVE_CARTEIRA);
        return;
      }

      setEnderecoCarteira(conta);
      localStorage.setItem(CHAVE_CARTEIRA, conta);
    }

    function atualizarRede() {
      /* recarrega a aplicação quando a rede da carteira muda */
      window.location.reload();
    }

    ethereum.on("accountsChanged", atualizarContas);
    ethereum.on("chainChanged", atualizarRede);

    return () => {
      ethereum.removeListener?.("accountsChanged", atualizarContas);
      ethereum.removeListener?.("chainChanged", atualizarRede);
    };
  }, []);

  return (
    <WalletContext.Provider
      value={{
        carteiraConectada,
        enderecoCarteira,
        conectando,
        conectarCarteira,
        desconectarCarteira,
      }}
    >
      {/* disponibiliza a carteira para a aplicação */}
      {children}
    </WalletContext.Provider>
  );
}