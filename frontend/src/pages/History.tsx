import { EvidenceTable } from "../components/evidencias/EvidenceTable";
import { listarEvidencias } from "../services/evidenciasService";

export function History() {
  const evidencias = listarEvidencias();

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-950">Histórico</h1>

      <p className="mt-2 text-slate-600">
        Visualize as evidências registradas pela sua conta.
      </p>

      <div className="mt-8">
        <EvidenceTable evidencias={evidencias} />
      </div>
    </div>
  );
}