import { LogOut, ShieldCheck, UserRound } from "lucide-react";

type PerfilUsuarioCardProps = {
  nome: string;
  email: string;
  onSair: () => void;
};

export function PerfilUsuarioCard({ nome, email, onSair }: PerfilUsuarioCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600 shadow-sm">
        {/* exibe o ícone do usuário */}
        <UserRound className="h-10 w-10" />
      </div>

      <h2 className="mt-5 font-display text-xl font-extrabold text-slate-950">
        {nome}
      </h2>

      <p className="mt-1 font-mono text-xs text-slate-400">{email}</p>

      <div className="my-6 h-px bg-slate-100" />

      <div className="space-y-4 text-left">
        <LinhaPerfil rotulo="perfil" valor="auditor público" />
        <LinhaPerfil rotulo="status" valor="conta ativa" />
        <LinhaPerfil rotulo="ambiente" valor="Sepolia Testnet" />
      </div>

      <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-left text-emerald-800">
        <div className="flex items-center gap-2">
          {/* exibe o status da conta */}
          <ShieldCheck className="h-4 w-4" />

          <span className="font-mono text-[10px] font-bold uppercase tracking-widest">
            credenciais válidas
          </span>
        </div>

        <p className="mt-2 text-xs leading-6">
          Esta conta pode consultar contratações, registrar evidências e acessar
          o histórico de auditorias.
        </p>
      </div>

      <button
        type="button"
        onClick={onSair}
        className="mt-6 flex w-full items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100"
      >
        {/* encerra a sessão atual */}
        <LogOut className="mr-2 h-4 w-4" />
        Sair da conta
      </button>
    </div>
  );
}

type LinhaPerfilProps = {
  rotulo: string;
  valor: string;
};

function LinhaPerfil({ rotulo, valor }: LinhaPerfilProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      {/* exibe o rótulo da informação */}
      <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
        {rotulo}
      </span>

      {/* exibe o valor da informação */}
      <strong className="text-right text-sm font-bold text-slate-900">
        {valor}
      </strong>
    </div>
  );
}