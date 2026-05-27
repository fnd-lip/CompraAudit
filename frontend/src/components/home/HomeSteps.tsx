const etapas = [
  {
    numero: "01",
    titulo: "Consulta de Dados",
    texto:
      "O usuário informa o identificador e consulta os dados de contratação vindos da fonte pública.",
  },
  {
    numero: "02",
    titulo: "Hash Criptográfico",
    texto:
      "O sistema normaliza os dados principais e gera uma impressão digital criptográfica única.",
  },
  {
    numero: "03",
    titulo: "Registro Blockchain",
    texto:
      "O hash é enviado para a blockchain por meio da carteira MetaMask, criando uma prova rastreável.",
  },
  {
    numero: "04",
    titulo: "Auditoria e Validação",
    texto:
      "Qualquer pessoa pode comparar a evidência registrada com os dados atuais da fonte pública.",
  },
];

export function HomeSteps() {
  return (
    <section className="border-t border-slate-200 bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-blue-600">
            Processo
          </p>

          <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-slate-950">
            Como funciona a auditoria verificável
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            A plataforma atua como uma camada de evidência sobre dados públicos.
            Ela não substitui os canais oficiais, mas adiciona uma prova
            criptográfica para comparação futura.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {etapas.map((etapa) => (
            <div
              key={etapa.numero}
              className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"
            >
              {/* exibe o número da etapa */}
              <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 font-mono text-lg font-bold text-blue-600">
                {etapa.numero}
              </div>

              <h3 className="font-display text-xl font-extrabold text-slate-950">
                {etapa.titulo}
              </h3>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                {etapa.texto}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}