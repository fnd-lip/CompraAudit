import { createContext } from "react";

export type WalletContextData = {
  enderecoCarteira: string;
  carteiraConectada: boolean;
  conectando: boolean;
  conectarCarteira: () => Promise<void>;
};

export const WalletContext = createContext<WalletContextData | null>(null);