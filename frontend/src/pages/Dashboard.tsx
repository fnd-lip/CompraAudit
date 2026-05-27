import { useEffect, useState } from "react";
import type { Evidencia } from "../types/evidencia";
import { PageContainer } from "../components/ui/PageContainer";
import { listarEvidencias } from "../services/evidenciasService";
import { useAuth } from "../hooks/useAuth";
import { useWallet } from "../hooks/useWallet";
import { DashboardHero } from "../components/dashboard/DashboardHero";
import { DashboardMetricas } from "../components/dashboard/DashboardMetricas";
import { DashboardAtalhos } from "../components/dashboard/DashboardAtalhos";
import { DashboardUltimasAuditorias } from "../components/dashboard/DashboardUltimasAuditorias";

type UsuarioBasico = {
  nome?: string;
  email?: string;
};

type AuthComUsuario = {
  usuario?: UsuarioBasico | null;
};

export function Dashboard() {
  const auth = useAuth();
  const wallet = useWallet();

  const usuario = "usuario" in auth ? (auth as AuthComUsuario).usuario : null;
  const nome = usuario?.nome || "Auditor Fiscal Felipe";

  const [evidencias, setEvidencias] = useState<Evidencia[]>([]);

  useEffect(() => {
    async function carregarEvidencias() {
      try {
        const resposta = await listarEvidencias();
        setEvidencias(resposta);
      } catch {
        setEvidencias([]);
      }
    }

    carregarEvidencias();
  }, []);

  return (
    <PageContainer className="space-y-8">
      {/* exibe o resumo principal do painel */}
      <DashboardHero nome={nome} />

      {/* exibe métricas principais e carteira */}
      <DashboardMetricas
        evidencias={evidencias}
        carteiraConectada={wallet.carteiraConectada}
        enderecoCarteira={wallet.enderecoCarteira}
      />

      {/* exibe atalhos de navegação */}
      <DashboardAtalhos />

      {/* exibe últimas auditorias reais */}
      <DashboardUltimasAuditorias evidencias={evidencias} />
    </PageContainer>
  );
}