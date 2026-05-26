import { useEffect, useState } from "react";
import { EvidenceTable } from "../components/evidencias/EvidenceTable";
import { listarEvidencias } from "../services/evidenciasService";
import type { Evidencia } from "../types/evidencia";

export function History() {
  const [evidencias, setEvidencias] = useState<Evidencia[]>([]);
  const [carregando, setCarregando] = useState(true);

  // carrega o historico do usuario autenticado 
  useEffect(() => {
    async function carregarHistorico() {
      try {
        const resposta = await listarEvidencias();
        setEvidencias(resposta);
      } catch {
        setEvidencias([]);
      } finally {
        setCarregando(false);
      }
    }

    carregarHistorico();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-950">Histórico</h1>

      <p className="mt-2 text-slate-600">
        Visualize as evidências registradas pela sua conta.
      </p>

      <div className="mt-8">
        {carregando ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            Carregando evidências...
          </div>
        ) : (
          <EvidenceTable evidencias={evidencias} />
        )}
      </div>
    </div>
  );
}