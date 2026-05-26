import { Wallet } from "lucide-react";
import { useWallet } from "../../hooks/useWallet";
import { reduzirHash } from "../../utils/reduceHash";

export function ConnectWalletButton() {
  const { enderecoCarteira, carteiraConectada, conectando, conectarCarteira } =
    useWallet();

  return (
    <button
      type="button"
      onClick={conectarCarteira}
      className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
    >
      <Wallet size={16} />
      {conectando
        ? "Conectando..."
        : carteiraConectada
          ? reduzirHash(enderecoCarteira)
          : "Conectar Carteira"}
    </button>
  );
}