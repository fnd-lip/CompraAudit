import { Link, NavLink } from "react-router-dom";
import { LogOut, Menu, Shield, Wallet, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useWallet } from "../../hooks/useWallet";
import { reduzirHash } from "../../utils/reduceHash";

const linksPublicos = [
  { texto: "Início", rota: "/" },
  { texto: "Verificar Evidência Pública", rota: "/verificar" },
];

const linksPrivados = [
  { texto: "Dashboard", rota: "/dashboard" },
  { texto: "Nova Auditoria", rota: "/nova-auditoria" },
  { texto: "Histórico", rota: "/historico" },
  { texto: "Verificação Pública", rota: "/verificar" },
  { texto: "Perfil", rota: "/perfil" },
];

function classeLink({ isActive }: { isActive: boolean }) {
  return `rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
    isActive
      ? "bg-blue-50 text-blue-600"
      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
  }`;
}

export function Header() {
  const [menuAberto, setMenuAberto] = useState(false);
  const { usuarioLogado, sair } = useAuth();
  const { carteiraConectada, enderecoCarteira, conectarCarteira } = useWallet();

  const links = usuarioLogado ? linksPrivados : linksPublicos;

  async function clicarCarteira() {
    if (!carteiraConectada) {
      await conectarCarteira();
    }
  }

  function fecharMenu() {
    setMenuAberto(false);
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white text-slate-800 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center" onClick={fecharMenu}>
            <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm shadow-blue-500/20">
              {/* exibe o símbolo principal da aplicação */}
              <Shield className="h-4 w-4" />
            </div>

            <span className="font-display text-lg font-bold tracking-tight text-slate-900">
              Compra<span className="text-blue-600">Audit</span>
            </span>

            <span className="ml-2 rounded border border-blue-100 bg-blue-50 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-blue-700">
              WEB3 AUDIT
            </span>
          </Link>

          <div className="hidden items-center space-x-1 md:flex">
            {links.map((link) => (
              <NavLink key={link.rota} to={link.rota} className={classeLink}>
                {/* exibe o link principal do menu */}
                {link.texto}
              </NavLink>
            ))}

            <div className="mx-2 h-4 w-px bg-slate-200" />

            {!usuarioLogado ? (
              <>
                <NavLink
                  to="/login"
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                >
                  Entrar
                </NavLink>

                <NavLink
                  to="/cadastro"
                  className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700"
                >
                  Criar Conta
                </NavLink>
              </>
            ) : (
              <button
                type="button"
                onClick={sair}
                className="flex items-center rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
              >
                {/* encerra a sessão autenticada */}
                <LogOut className="mr-1.5 h-4 w-4" />
                Sair
              </button>
            )}
          </div>

          <div className="hidden items-center md:flex">
            <button
              type="button"
              onClick={clicarCarteira}
              className={`flex items-center rounded-full border px-4 py-2 font-mono text-xs font-bold transition-all duration-200 ${
                carteiraConectada
                  ? "border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100/50"
                  : "border-blue-200 bg-white text-blue-600 hover:bg-blue-50"
              }`}
            >
              {/* exibe o estado da carteira */}
              <Wallet className="mr-1.5 h-3.5 w-3.5" />

              {carteiraConectada
                ? reduzirHash(enderecoCarteira)
                : "Conectar Carteira"}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMenuAberto((aberto) => !aberto)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          >
            {/* alterna o menu mobile */}
            {menuAberto ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuAberto && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <div className="space-y-2">
            {links.map((link) => (
              <NavLink
                key={link.rota}
                to={link.rota}
                onClick={fecharMenu}
                className={classeLink}
              >
                {/* exibe o link mobile */}
                {link.texto}
              </NavLink>
            ))}

            {!usuarioLogado ? (
              <>
                <NavLink
                  to="/login"
                  onClick={fecharMenu}
                  className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Entrar
                </NavLink>

                <NavLink
                  to="/cadastro"
                  onClick={fecharMenu}
                  className="block rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white"
                >
                  Criar Conta
                </NavLink>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  sair();
                  fecharMenu();
                }}
                className="block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                Sair
              </button>
            )}

            <button
              type="button"
              onClick={clicarCarteira}
              className="mt-2 flex w-full items-center justify-center rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 font-mono text-xs font-bold text-blue-600"
            >
              {/* exibe a carteira no menu mobile */}
              <Wallet className="mr-1.5 h-3.5 w-3.5" />

              {carteiraConectada
                ? reduzirHash(enderecoCarteira)
                : "Conectar Carteira"}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}