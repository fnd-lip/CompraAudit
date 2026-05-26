import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { WalletContext } from "./WalletContextValue";

type WalletProviderProps = {
  children: ReactNode;
};

export function WalletProvider({ children }: WalletProviderProps) {
  const [enderecoCarteira, setEnderecoCarteira] = useState("");
  const [conectando, setConectando] = useState(false);

  async function conectarCarteira() {
    if (!window.ethereum) {
      alert("MetaMask não encontrada.");
      return;
    }

    setConectando(true);

    try {
      const contas = (await window.ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];

      setEnderecoCarteira(contas[0]);
    } finally {
      setConectando(false);
    }
  }

  const valorContexto = useMemo(
    () => ({
      enderecoCarteira,
      carteiraConectada: Boolean(enderecoCarteira),
      conectando,
      conectarCarteira,
    }),
    [enderecoCarteira, conectando]
  );

  return (
    <WalletContext.Provider value={valorContexto}>
      {children}
    </WalletContext.Provider>
  );
}