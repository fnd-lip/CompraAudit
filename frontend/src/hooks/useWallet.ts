import { useContext } from "react";
import { WalletContext } from "../context/WalletContextValue";

export function useWallet() {
  const contexto = useContext(WalletContext);

  if (!contexto) {
    throw new Error("useWallet deve ser usado dentro de WalletProvider.");
  }

  return contexto;
}