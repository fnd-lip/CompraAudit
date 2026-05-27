import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type { ResultadoVerificacaoPublica } from "../../types/evidencia";

type BannerResultadoVerificacaoProps = {
  resultado: ResultadoVerificacaoPublica | null;
  verificado: boolean;
};

export function BannerResultadoVerificacao({
  resultado,
  verificado,
}: BannerResultadoVerificacaoProps) {
  if (!verificado) {
    return null;
  }

  if (!resultado) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900 shadow-sm">
        <div className="flex gap-3">
          {/* exibe o alerta de busca sem resultado */}
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />

          <div>
            <h2 className="font-mono text-sm font-bold uppercase tracking-widest">
              evidência não encontrada
            </h2>

            <p className="mt-2 text-sm leading-7">
              Não foi possível localizar uma evidência com esse identificador,
              ID ou hash. Confira a informação digitada e tente novamente.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const compativel = resultado.status === "COMPATIVEL";

  return (
    <div
      className={`rounded-2xl border p-6 shadow-sm ${
        compativel
          ? "border-emerald-200 bg-emerald-50 text-emerald-900"
          : "border-red-200 bg-red-50 text-red-900"
      }`}
    >
      <div className="flex gap-3">
        {/* exibe o status principal da comparação */}
        {compativel ? (
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
        ) : (
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
        )}

        <div>
          <h2 className="font-mono text-sm font-bold uppercase tracking-widest">
            {compativel
              ? "evidência compatível · integridade comprovada"
              : "divergência detectada · revisão necessária"}
          </h2>

          <p className="mt-2 text-sm leading-7">{resultado.mensagem}</p>
        </div>
      </div>
    </div>
  );
}