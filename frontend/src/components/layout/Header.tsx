import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { ConnectWalletButton } from "../wallet/ConnectWalletButton";

export function Header() {
  const { usuarioLogado } = useAuth();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
            <ShieldCheck size={22} />
          </div>

          <span className="text-xl font-bold text-slate-950">
            Compra<span className="text-blue-600">Audit</span>
          </span>
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link to="/" className="hover:text-blue-600">
            Início
          </Link>

          <Link to="/verificar" className="hover:text-blue-600">
            Verificar Evidência Pública
          </Link>

          {usuarioLogado ? (
            <>
              <Link to="/dashboard" className="hover:text-blue-600">
                Dashboard
              </Link>

              <ConnectWalletButton />
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-600">
                Entrar
              </Link>

              <Link
                to="/cadastro"
                className="rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
              >
                Criar Conta
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}