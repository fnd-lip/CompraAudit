import { useState } from "react";
import type { Evidencia } from "../types/evidencia";
import { Button } from "../components/ui/Button";
import { VerificationResult } from "../components/evidencias/VerificationResult";
import { buscarEvidenciaPublica } from "../services/evidenciasService";

export function PublicVerification() {
  const [consulta, setConsulta] = useState("");
  const [evidencia, setEvidencia] = useState<Evidencia | null>(null);
  const [verificado, setVerificado] = useState(false);

  function verificar() {
    const resultado = buscarEvidenciaPublica(consulta);
    setEvidencia(resultado);
    setVerificado(true);
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-950">
          Verificar evidência pública
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Informe o identificador da contratação ou o hash da evidência para
          verificar se o registro continua compatível com a prova on-chain.
        </p>

        <div className="mt-8 flex gap-3">
          <input
            value={consulta}
            onChange={(evento) => setConsulta(evento.target.value)}
            className="flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
            placeholder="Ex: 0xabc... ou ID da contratação"
          />

          <Button type="button" onClick={verificar}>
            Verificar
          </Button>
        </div>

        {verificado && (
          <div className="mt-6">
            <VerificationResult evidencia={evidencia} />
          </div>
        )}
      </div>
    </section>
  );
}