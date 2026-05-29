import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

type PasswordInputProps = {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  onChange: (valor: string) => void;
};

export function PasswordInput({
  id,
  label,
  value,
  placeholder = "Digite sua senha",
  onChange,
}: PasswordInputProps) {
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  function alternarVisibilidadeSenha() {
    setSenhaVisivel((valorAtual) => !valorAtual);
  }

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type={senhaVisivel ? "text" : "password"}
          value={value}
          onChange={(evento) => onChange(evento.target.value)}
          placeholder={placeholder}
          required
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10"
        />

        <button
          type="button"
          onClick={alternarVisibilidadeSenha}
          aria-label={senhaVisivel ? "Ocultar senha" : "Mostrar senha"}
          className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-blue-600"
        >
          {/* alterna a visibilidade da senha */}
          {senhaVisivel ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}