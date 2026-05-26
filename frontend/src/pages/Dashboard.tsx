import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, FileCheck, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import type { Evidencia } from "../types/evidencia";
import { Card } from "../components/ui/Card";
import { WalletStatus } from "../components/wallet/WalletStatus";
import { listarEvidencias } from "../services/evidenciasService";

export function Dashboard() {
  const [evidencias, setEvidencias] = useState<Evidencia[]>([]);
  const [carregando, setCarregando] = useState(true);

  // carrega as evidencias salvas no backend 
  useEffect(() => {
    async function carregarEvidencias() {
      try {
        const resposta = await listarEvidencias();
        setEvidencias(resposta);
      } catch {
        setEvidencias([]);
      } finally {
        setCarregando(false);
      }
    }

    carregarEvidencias();
  }, []);

  const totalCompatíveis = evidencias.filter(
    (evidencia) => evidencia.status === "COMPATIVEL"
  ).length;

  const totalDivergentes = evidencias.filter(
    (evidencia) => evidencia.status === "DIVERGENTE"
  ).length;

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Dashboard</h1>
          <p className="mt-2 text-slate-600">
            Acompanhe suas evidências e auditorias registradas.
          </p>
        </div>

        <WalletStatus />
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <CardResumo
          titulo="Evidências registradas"
          valor={carregando ? "..." : String(evidencias.length)}
          icone={<FileCheck />}
        />

        <CardResumo
          titulo="Compatíveis"
          valor={carregando ? "..." : String(totalCompatíveis)}
          icone={<ShieldCheck />}
        />

        <CardResumo
          titulo="Divergentes"
          valor={carregando ? "..." : String(totalDivergentes)}
          icone={<AlertTriangle />}
        />
      </div>

      <Card className="mt-8">
        <h2 className="text-xl font-bold">Comece uma nova auditoria</h2>

        <p className="mt-2 text-sm text-slate-600">
          Consulte uma contratação pública, gere o hash dos dados e registre a
          evidência na blockchain.
        </p>

        <Link
          to="/nova-auditoria"
          className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Nova Auditoria
        </Link>
      </Card>
    </div>
  );
}

type CardResumoProps = {
  titulo: string;
  valor: string;
  icone: ReactNode;
};

function CardResumo({ titulo, valor, icone }: CardResumoProps) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-600">{titulo}</p>
        <div className="text-blue-600">{icone}</div>
      </div>

      <strong className="mt-4 block text-3xl font-bold text-slate-950">
        {valor}
      </strong>
    </Card>
  );
}