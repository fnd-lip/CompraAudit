import { Link } from "react-router-dom";
import { NOMES_UF } from "../constantesMapaAuditoria";
import {
  obterHashDadosEvidencia,
  obterHashTransacaoEvidencia,
  obterIdEvidencia,
  obterIdentificadorEvidencia,
  obterOrgaoEvidencia,
} from "../utils/evidenciaMapaAuditoria";
import type { MarcadorBlockchain } from "./tiposMapaLeaflet";

type PopupRegistroBlockchainProps = {
  marcador: MarcadorBlockchain;
};

// Popup exibido quando o usuário clica em um ponto azul do mapa.
// Aqui ficam os detalhes do contrato/evidência registrada na blockchain.
export function PopupRegistroBlockchain({
  marcador,
}: PopupRegistroBlockchainProps) {
  const idEvidencia = obterIdEvidencia(marcador.evidencia);
  const identificador = obterIdentificadorEvidencia(marcador.evidencia);
  const orgao = obterOrgaoEvidencia(marcador.evidencia);
  const hashDados = obterHashDadosEvidencia(marcador.evidencia);
  const hashTransacao = obterHashTransacaoEvidencia(marcador.evidencia);

  return (
    <div className="w-72 space-y-3">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
          Registro on-chain
        </p>

        <h4 className="text-base font-black text-slate-950">
          {marcador.municipio} / {marcador.uf}
        </h4>

        <p className="text-xs text-slate-500">
          {NOMES_UF[marcador.uf] || "UF não identificada"}
        </p>

        {marcador.localizacaoAproximada && (
          <p className="mt-1 text-xs font-semibold text-amber-600">
            Localização estimada pelo município/UF.
          </p>
        )}
      </div>

      <div>
        <p className="text-xs font-bold text-slate-500">Órgão</p>

        <p className="text-sm font-semibold text-slate-800">{orgao}</p>
      </div>

      <div>
        <p className="text-xs font-bold text-slate-500">Identificador</p>

        <p className="break-all font-mono text-xs text-slate-800">
          {identificador}
        </p>
      </div>

      {hashDados && (
        <div>
          <p className="text-xs font-bold text-slate-500">Hash da evidência</p>

          <p className="break-all font-mono text-xs text-slate-800">
            {hashDados}
          </p>
        </div>
      )}

      {hashTransacao && (
        <div>
          <p className="text-xs font-bold text-slate-500">Transação Sepolia</p>

          <p className="break-all font-mono text-xs text-slate-800">
            {hashTransacao}
          </p>
        </div>
      )}

      {idEvidencia && (
        <Link
          to={`/evidencias/${idEvidencia}`}
          className="inline-flex rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white"
        >
          Abrir detalhes
        </Link>
      )}
    </div>
  );
}
