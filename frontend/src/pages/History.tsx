import { useEffect, useMemo, useState } from "react";
import type { Evidencia } from "../types/evidencia";
import { PageContainer } from "../components/ui/PageContainer";
import { PageHeader } from "../components/ui/PageHeader";
import { listarEvidencias } from "../services/evidenciasService";
import { FiltrosHistorico } from "../components/historico/FiltrosHistorico";
import { ResumoHistorico } from "../components/historico/ResumoHistorico";
import { TabelaHistorico } from "../components/historico/TabelaHistorico";

export function History() {
  const [evidencias, setEvidencias] = useState<Evidencia[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [filtroIdentificador, setFiltroIdentificador] = useState("");
  const [filtroOrgao, setFiltroOrgao] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");

  useEffect(() => {
    async function carregarEvidencias() {
      setCarregando(true);

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

  const evidenciasFiltradas = useMemo(() => {
    return evidencias.filter((evidencia) => {
      const identificadorConfere = evidencia.identificador
        .toLowerCase()
        .includes(filtroIdentificador.toLowerCase());

      const orgaoConfere = (evidencia.contratacao?.orgao || "")
        .toLowerCase()
        .includes(filtroOrgao.toLowerCase());

      const statusConfere = filtroStatus
        ? evidencia.status === filtroStatus
        : true;

      return identificadorConfere && orgaoConfere && statusConfere;
    });
  }, [evidencias, filtroIdentificador, filtroOrgao, filtroStatus]);

  return (
    <PageContainer className="space-y-8">
      <PageHeader
        titulo="Histórico Geral de Auditorias"
        descricao="Consulte, filtre e inspecione as evidências criptográficas registradas pela sua conta."
      />

      <ResumoHistorico evidencias={evidencias} />

      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        <FiltrosHistorico
          filtroIdentificador={filtroIdentificador}
          filtroOrgao={filtroOrgao}
          filtroStatus={filtroStatus}
          onFiltroIdentificadorChange={setFiltroIdentificador}
          onFiltroOrgaoChange={setFiltroOrgao}
          onFiltroStatusChange={setFiltroStatus}
        />

        {carregando ? (
          <div className="flex min-h-90 items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div>
              {/* exibe carregamento do histórico */}
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

              <p className="mt-4 font-mono text-xs font-bold uppercase tracking-widest text-slate-400">
                carregando histórico...
              </p>
            </div>
          </div>
        ) : (
          <TabelaHistorico evidencias={evidenciasFiltradas} />
        )}
      </div>
    </PageContainer>
  );
}