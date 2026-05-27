import { Eye, History, PlusCircle, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

const atalhos = [
  {
    titulo: "Nova Auditoria",
    descricao: "registrar prova de contratação",
    rota: "/nova-auditoria",
    icone: <PlusCircle className="h-5 w-5" />,
    cor: "azul",
  },
  {
    titulo: "Histórico",
    descricao: "ver registros cadastrados",
    rota: "/historico",
    icone: <History className="h-5 w-5" />,
    cor: "neutro",
  },
  {
    titulo: "Pública",
    descricao: "verificar integridade de dados",
    rota: "/verificar",
    icone: <Eye className="h-5 w-5" />,
    cor: "ciano",
  },
  {
    titulo: "Perfil",
    descricao: "visualizar conta e carteira",
    rota: "/perfil",
    icone: <UserRound className="h-5 w-5" />,
    cor: "verde",
  },
];

export function DashboardAtalhos() {
  return (
    <section>
      <h2 className="mb-5 font-display text-xl font-extrabold text-slate-950">
        Navegação e Atalhos Rápidos
      </h2>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {atalhos.map((atalho) => (
          <AtalhoCard key={atalho.rota} {...atalho} />
        ))}
      </div>
    </section>
  );
}

type AtalhoCardProps = {
  titulo: string;
  descricao: string;
  rota: string;
  icone: ReactNode;
  cor: string;
};

function AtalhoCard({ titulo, descricao, rota, icone, cor }: AtalhoCardProps) {
  const classeIcone = {
    azul: "bg-blue-50 text-blue-600",
    neutro: "bg-slate-100 text-slate-600",
    ciano: "bg-cyan-50 text-cyan-600",
    verde: "bg-emerald-50 text-emerald-600",
  }[cor];

  return (
    <Link
      to={rota}
      className="group rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div
        className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl ${classeIcone}`}
      >
        {/* exibe o ícone do atalho */}
        {icone}
      </div>

      <h3 className="mt-5 font-display text-base font-extrabold text-slate-950">
        {titulo}
      </h3>

      <p className="mt-1 text-sm text-slate-400">{descricao}</p>
    </Link>
  );
}