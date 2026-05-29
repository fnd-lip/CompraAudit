import { createContext } from "react";

export type WalletContextData = {
  carteiraConectada: boolean;
  enderecoCarteira: string;
  conectando: boolean;
  conectarCarteira: () => Promise<void>;
  desconectarCarteira: () => Promise<void>;
};

export const WalletContext = createContext<WalletContextData | null>(null);