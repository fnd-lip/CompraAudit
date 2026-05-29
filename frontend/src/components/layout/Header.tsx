import { Link, NavLink } from "react-router-dom";
import {
  ChevronDown,
  Copy,
  LogOut,
  Menu,
  Shield,
  Wallet,
  X,
} from "lucide-react";
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

type UsuarioBasico = {
  nome?: string;
  email?: string;
};

type AuthComUsuario = {
  usuario?: UsuarioBasico | null;
};

function classeLink({ isActive }: { isActive: boolean }) {
  return `rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
    isActive
      ? "bg-blue-50 text-blue-600"
      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
  }`;
}

export function Header() {
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);
  const [menuPerfilAberto, setMenuPerfilAberto] = useState(false);

  const auth = useAuth();
  const wallet = useWallet();

  const usuario = "usuario" in auth ? (auth as AuthComUsuario).usuario : null;

  const nome = usuario?.nome || "Auditor Fiscal Felipe";
  const email = usuario?.email || "felipeisbg@gmail.com";
  const links = auth.usuarioLogado ? linksPrivados : linksPublicos;

  async function clicarCarteira() {
    await wallet.conectarCarteira();
  }

  async function trocarCarteira() {
    await wallet.conectarCarteira();
  }

  async function copiarCarteira() {
    if (!wallet.carteiraConectada || !wallet.enderecoCarteira) {
      return;
    }

    await navigator.clipboard.writeText(wallet.enderecoCarteira);
    alert("Endereço da carteira copiado.");
  }

  function fecharMenus() {
    setMenuMobileAberto(false);
    setMenuPerfilAberto(false);
  }

  function sairDaConta() {
    auth.sair();
    fecharMenus();
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white text-slate-800 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center" onClick={fecharMenus}>
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

            {!auth.usuarioLogado ? (
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
            ) : null}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <button
              type="button"
              onClick={clicarCarteira}
              className={`flex items-center rounded-full border px-4 py-2 font-mono text-xs font-bold transition-all duration-200 ${
                wallet.carteiraConectada
                  ? "border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100/50"
                  : "border-blue-200 bg-white text-blue-600 hover:bg-blue-50"
              }`}
            >
              {/* exibe o estado da carteira */}
              <Wallet className="mr-1.5 h-3.5 w-3.5" />

              {wallet.carteiraConectada
                ? reduzirHash(wallet.enderecoCarteira)
                : "Conectar Carteira"}

              {wallet.carteiraConectada && (
                <span className="ml-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
              )}
            </button>

            {auth.usuarioLogado && (
              <div className="relative flex items-center border-l border-slate-200 pl-3">
                <button
                  type="button"
                  onClick={() => setMenuPerfilAberto((aberto) => !aberto)}
                  className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-slate-50"
                >
                  {/* exibe a identidade do usuário */}
                  <div className="text-right">
                    <p className="max-w-40 truncate text-sm font-bold text-slate-900">
                      {nome}
                    </p>

                    <p className="max-w-40 truncate font-mono text-xs text-slate-400">
                      {email}
                    </p>
                  </div>

                  <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500">
                    <ChevronDown
                      className={`h-4 w-4 transition ${
                        menuPerfilAberto ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {menuPerfilAberto && (
                  <div className="absolute right-0 top-12 z-50 w-[360px] rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-900/10">
                    <div className="border-b border-slate-100 pb-4">
                      <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        perfil autenticado
                      </p>

                      <h3 className="mt-2 font-display text-xl font-extrabold text-slate-950">
                        {nome}
                      </h3>

                      <p className="mt-1 font-mono text-xs text-slate-400">
                        {email}
                      </p>
                    </div>

                    <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          metamask
                        </span>

                        <span
                          className={`rounded-md border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest ${
                            wallet.carteiraConectada
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border-amber-200 bg-amber-50 text-amber-700"
                          }`}
                        >
                          {wallet.carteiraConectada ? "conectado" : "pendente"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3">
                        <p className="min-w-0 flex-1 break-all font-mono text-xs font-bold text-slate-700">
                          {wallet.carteiraConectada
                            ? wallet.enderecoCarteira
                            : "carteira não conectada"}
                        </p>

                        <button
                          type="button"
                          onClick={copiarCarteira}
                          disabled={!wallet.carteiraConectada}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {/* copia o endereço da carteira */}
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>

                      <p className="mt-3 text-sm text-slate-500">
                        <span className="font-bold text-slate-700">Rede:</span>{" "}
                        Sepolia Testnet
                      </p>
                    </div>

                    <div className="mt-4 grid gap-3">
                      <button
                        type="button"
                        onClick={trocarCarteira}
                        className="flex items-center justify-center rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
                      >
                        {/* conecta ou troca a carteira */}
                        <Wallet className="mr-2 h-4 w-4" />
                        {wallet.carteiraConectada
                          ? "Trocar Carteira"
                          : "Conectar Carteira"}
                      </button>

                      <button
                        type="button"
                        onClick={wallet.desconectarCarteira}
                        disabled={!wallet.carteiraConectada}
                        className="flex items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {/* desconecta a carteira no estado local da aplicação */}
                        Desconectar Carteira
                      </button>

                      <button
                        type="button"
                        onClick={sairDaConta}
                        className="flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                      >
                        {/* encerra a sessão autenticada */}
                        <LogOut className="mr-2 h-4 w-4" />
                        Sair da Conta
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMenuMobileAberto((aberto) => !aberto)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          >
            {/* alterna o menu mobile */}
            {menuMobileAberto ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {menuMobileAberto && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <div className="space-y-2">
            {links.map((link) => (
              <NavLink
                key={link.rota}
                to={link.rota}
                onClick={fecharMenus}
                className={classeLink}
              >
                {/* exibe o link mobile */}
                {link.texto}
              </NavLink>
            ))}

            {!auth.usuarioLogado ? (
              <>
                <NavLink
                  to="/login"
                  onClick={fecharMenus}
                  className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Entrar
                </NavLink>

                <NavLink
                  to="/cadastro"
                  onClick={fecharMenus}
                  className="block rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white"
                >
                  Criar Conta
                </NavLink>
              </>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-bold text-slate-900">{nome}</p>
                <p className="font-mono text-xs text-slate-400">{email}</p>

                <button
                  type="button"
                  onClick={sairDaConta}
                  className="mt-3 block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  Sair
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={clicarCarteira}
              className="mt-2 flex w-full items-center justify-center rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 font-mono text-xs font-bold text-blue-600"
            >
              {/* exibe a carteira no menu mobile */}
              <Wallet className="mr-1.5 h-3.5 w-3.5" />

              {wallet.carteiraConectada
                ? reduzirHash(wallet.enderecoCarteira)
                : "Conectar Carteira"}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
