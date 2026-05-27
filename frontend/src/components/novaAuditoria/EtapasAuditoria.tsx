import { CheckCircle2 } from "lucide-react";

type EtapasAuditoriaProps = {
  temContratacao: boolean;
  temHash: boolean;
  registrando: boolean;
};

const etapas = [
  {
    numero: "1",
    titulo: "Consultar e Auditar",
    texto: "Dados oficiais recuperados da fonte pública.",
  },
  {
    numero: "2",
    titulo: "Hash SHA-256",
    texto: "Impressão digital calculada sobre dados normalizados.",
  },
  {
    numero: "3",
    titulo: "Firma On-chain",
    texto: "Prova registrada via MetaMask em blockchain.",
  },
];

export function EtapasAuditoria({
  temContratacao,
  temHash,
  registrando,
}: EtapasAuditoriaProps) {
  function etapaAtiva(numero: string) {
    if (numero === "1") return temContratacao;
    if (numero === "2") return temHash;
    if (numero === "3") return registrando;
    return false;
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="mb-6 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
        fases da auditoria
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        {etapas.map((etapa) => {
          const ativa = etapaAtiva(etapa.numero);

          return (
            <div
              key={etapa.numero}
              className={`rounded-2xl border p-5 transition ${
                ativa
                  ? "border-blue-200 bg-blue-50"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <div className="mb-3 flex items-center gap-3">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-lg font-mono text-xs font-bold ${
                    ativa
                      ? "bg-blue-600 text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {ativa ? <CheckCircle2 className="h-4 w-4" /> : etapa.numero}
                </div>

                <h3 className="font-display text-sm font-extrabold text-slate-800">
                  {etapa.titulo}
                </h3>
              </div>

              <p className="text-xs leading-5 text-slate-500">{etapa.texto}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}