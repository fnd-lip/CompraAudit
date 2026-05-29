import { Eye, EyeOff, Lock, Mail, User, Wallet } from "lucide-react";
import { useState } from "react";
import { useWallet } from "../../hooks/useWallet";
import { reduzirHash } from "../../utils/reduceHash";

type EventoFormulario = {
  preventDefault: () => void;
};

type RegisterFormProps = {
  onSubmit: (
    nome: string,
    email: string,
    senha: string,
    enderecoCarteira?: string
  ) => void | Promise<void>;
};

export function RegisterForm({ onSubmit }: RegisterFormProps) {
  const wallet = useWallet();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [confirmarSenhaVisivel, setConfirmarSenhaVisivel] = useState(false);
  const [carregando, setCarregando] = useState(false);

  async function enviarFormulario(evento: EventoFormulario) {
    evento.preventDefault();

    if (senha !== confirmarSenha) {
      alert("As senhas não conferem.");
      return;
    }

    setCarregando(true);

    try {
      await onSubmit(
        nome,
        email,
        senha,
        wallet.carteiraConectada ? wallet.enderecoCarteira : undefined
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <form onSubmit={enviarFormulario} className="space-y-4">
      <div>
        <label
          htmlFor="nome-cadastro"
          className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400"
        >
          nome completo ou instituição
        </label>

        <div className="relative">
          <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            id="nome-cadastro"
            type="text"
            value={nome}
            onChange={(evento) => setNome(evento.target.value)}
            placeholder="Ex: João da Silva ou Controladoria Municipal"
            required
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="email-cadastro"
          className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400"
        >
          e-mail institucional
        </label>

        <div className="relative">
          <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            id="email-cadastro"
            type="email"
            value={email}
            onChange={(evento) => setEmail(evento.target.value)}
            placeholder="auditoria@orgao.gov.br"
            required
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
          />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label
            htmlFor="senha-cadastro"
            className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400"
          >
            senha
          </label>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              id="senha-cadastro"
              type={senhaVisivel ? "text" : "password"}
              value={senha}
              onChange={(evento) => setSenha(evento.target.value)}
              placeholder="Sua senha"
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-11 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
            />

            <button
              type="button"
              onClick={() => setSenhaVisivel((valorAtual) => !valorAtual)}
              aria-label={senhaVisivel ? "Ocultar senha" : "Mostrar senha"}
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-blue-600"
            >
              {/* alterna a visualização da senha */}
              {senhaVisivel ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="confirmar-senha-cadastro"
            className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400"
          >
            confirmar senha
          </label>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              id="confirmar-senha-cadastro"
              type={confirmarSenhaVisivel ? "text" : "password"}
              value={confirmarSenha}
              onChange={(evento) => setConfirmarSenha(evento.target.value)}
              placeholder="Repita a senha"
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-11 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
            />

            <button
              type="button"
              onClick={() =>
                setConfirmarSenhaVisivel((valorAtual) => !valorAtual)
              }
              aria-label={
                confirmarSenhaVisivel
                  ? "Ocultar confirmação de senha"
                  : "Mostrar confirmação de senha"
              }
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-blue-600"
            >
              {/* alterna a visualização da confirmação de senha */}
              {confirmarSenhaVisivel ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <div className="mb-2 flex items-center gap-2">
          <Wallet className="h-4 w-4 text-blue-600" />

          <h2 className="font-mono text-[11px] font-bold uppercase tracking-widest text-slate-950">
            carteira blockchain
          </h2>
        </div>

        <p className="text-xs leading-5 text-slate-500">
          Conecte a MetaMask para assinar evidências na rede Sepolia.
        </p>

        <button
          type="button"
          onClick={wallet.conectarCarteira}
          disabled={wallet.conectando}
          className="mt-3 flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {/* conecta a carteira metamask */}
          <span
            className={`mr-2 h-2.5 w-2.5 rounded-full ${
              wallet.carteiraConectada ? "bg-emerald-500" : "bg-amber-400"
            }`}
          />

          {wallet.conectando
            ? "Aguardando MetaMask"
            : wallet.carteiraConectada
              ? reduzirHash(wallet.enderecoCarteira)
              : "Conectar MetaMask"}
        </button>
      </div>

      <button
        type="submit"
        disabled={carregando}
        className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {/* envia os dados de cadastro */}
        {carregando ? "Criando conta..." : "Criar conta"}
      </button>
    </form>
  );
}