import { Badge } from "../ui/Badge";
import { useWallet } from "../../hooks/useWallet";
import { reduzirHash } from "../../utils/reduceHash";

export function WalletStatus() {
  const { carteiraConectada, enderecoCarteira } = useWallet();

  if (!carteiraConectada) {
    return <Badge tipo="aviso">Carteira não conectada</Badge>;
  }

  return <Badge tipo="sucesso">Carteira {reduzirHash(enderecoCarteira)}</Badge>;
}