import type { ReactNode } from "react";

type PageHeaderProps = {
  titulo: string;
  descricao: string;
  acao?: ReactNode;
};

export function PageHeader({ titulo, descricao, acao }: PageHeaderProps) {
  return (
    <div className="border-b border-slate-200 pb-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          {/* exibe o título principal da página */}
          <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-slate-950">
            {titulo}
          </h1>

          {/* exibe a descrição curta da página */}
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            {descricao}
          </p>
        </div>

        {acao && <div>{acao}</div>}
      </div>
    </div>
  );
}