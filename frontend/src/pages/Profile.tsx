import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { WalletStatus } from "../components/wallet/WalletStatus";
import { ConnectWalletButton } from "../components/wallet/ConnectWalletButton";
import { useAuth } from "../hooks/useAuth";

export function Profile() {
  const navegar = useNavigate();
  const { usuario, sair } = useAuth();

  function sairDaConta() {
    sair();
    navegar("/");
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-950">Perfil</h1>

      <Card className="mt-8">
        <p className="text-sm text-slate-600">Nome</p>
        <p className="mt-1 font-semibold text-slate-950">{usuario?.nome}</p>

        <p className="mt-5 text-sm text-slate-600">E-mail</p>
        <p className="mt-1 font-semibold text-slate-950">{usuario?.email}</p>

        <div className="mt-6">
          <WalletStatus />
        </div>

        <div className="mt-4">
          <ConnectWalletButton />
        </div>

        <Button
          type="button"
          variante="perigo"
          className="mt-8"
          onClick={sairDaConta}
        >
          Sair
        </Button>
      </Card>
    </div>
  );
}