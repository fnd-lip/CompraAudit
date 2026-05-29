import { useState } from "react";
import { PasswordInput } from "./PasswordInput";

type EventoFormulario = {
  preventDefault: () => void;
};

type LoginFormProps = {
  onSubmit: (email: string, senha: string) => void | Promise<void>;
};

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function enviarFormulario(evento: EventoFormulario) {
    evento.preventDefault();
    setCarregando(true);

    try {
      await onSubmit(email, senha);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <form onSubmit={enviarFormulario} className="space-y-6">
      <div>
        <label
          htmlFor="email-login"
          className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400"
        >
          e-mail
        </label>

        <input
          id="email-login"
          type="email"
          value={email}
          onChange={(evento) => setEmail(evento.target.value)}
          placeholder="seu@email.com"
          required
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
        />
      </div>

      <PasswordInput
        id="senha-login"
        label="senha"
        value={senha}
        onChange={setSenha}
      />

      <button
        type="submit"
        disabled={carregando}
        className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {/* envia os dados de login */}
        {carregando ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}