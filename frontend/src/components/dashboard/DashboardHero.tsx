type DashboardHeroProps = {
  nome: string;
};

export function DashboardHero({ nome }: DashboardHeroProps) {
  return (
    <section className="rounded-3xl bg-slate-950 p-8 text-white shadow-sm">
      <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-blue-300">
        painel do auditor público
      </p>

      <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight">
        Olá, {nome}!
      </h1>

      <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400">
        Acompanhe as evidências registradas, consulte auditorias recentes e
        inicie novos registros criptográficos de contratações públicas.
      </p>
    </section>
  );
}