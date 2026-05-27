import { Copy, ExternalLink, RefreshCcw, Shield, Wallet } from "lucide-react";
import { ENDERECO_CONTRATO, EXPLORER_URL } from "../../services/contracts";
import { reduzirHash } from "../../utils/reduceHash";

type PerfilCarteiraCardProps = {
  carteiraConectada: boolean;
  enderecoCarteira: string;
  onConectar: () => void;
  onDesconectar?: () => void;
};

export function PerfilCarteiraCard({
  carteiraConectada,
  enderecoCarteira,
  onConectar,
  onDesconectar,
}: PerfilCarteiraCardProps) {
  const enderecoVisivel = carteiraConectada
    ? enderecoCarteira
    : "carteira não conectada";

  const linkContrato = `${EXPLORER_URL}/address/${ENDERECO_CONTRATO}`;

  async function copiarEndereco() {
    if (!carteiraConectada || !enderecoCarteira) {
      return;
    }

    await navigator.clipboard.writeText(enderecoCarteira);
    alert("Endereço copiado.");
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <Wallet className="h-5 w-5 text-blue-600" />

          <h2 className="font-display text-xl font-extrabold text-slate-950">
            Parâmetros de Conexão MetaMask
          </h2>
        </div>

        <span
          className={`rounded-md border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest ${
            carteiraConectada
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-amber-200 bg-amber-50 text-amber-700"
          }`}
        >
          {carteiraConectada ? "integrada" : "pendente"}
        </span>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <label className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
          endereço da carteira
        </label>

        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
          <strong className="min-w-0 flex-1 break-all font-mono text-sm text-slate-900">
            {enderecoVisivel}
          </strong>

          <button
            type="button"
            onClick={copiarEndereco}
            disabled={!carteiraConectada}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {/* copia o endereço da carteira */}
            <Copy className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <BlocoInfo rotulo="rede configurada" valor="Sepolia Testnet" />
          <BlocoInfo rotulo="contrato ativo" valor={reduzirHash(ENDERECO_CONTRATO)} />
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-slate-950 p-5 text-white">
        <div className="flex items-start gap-3">
          <Shield className="mt-0.5 h-5 w-5 text-blue-300" />

          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-blue-300">
              uso da carteira
            </p>

            <p className="mt-2 text-sm leading-7 text-slate-300">
              A MetaMask é usada para assinar o registro da prova on-chain. Os
              dados completos da contratação continuam armazenados off-chain.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <button
          type="button"
          onClick={onConectar}
          className="flex items-center justify-center rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
        >
          {/* conecta ou troca a carteira */}
          <RefreshCcw className="mr-2 h-4 w-4" />
          {carteiraConectada ? "Trocar Carteira" : "Conectar Carteira"}
        </button>

        <a
          href={linkContrato}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
        >
          {/* abre o contrato no explorador */}
          Ver contrato
          <ExternalLink className="ml-2 h-4 w-4" />
        </a>

        <button
          type="button"
          onClick={onDesconectar}
          disabled={!onDesconectar || !carteiraConectada}
          className="flex items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {/* desconecta a carteira quando disponível */}
          Desconectar
        </button>
      </div>
    </div>
  );
}

type BlocoInfoProps = {
  rotulo: string;
  valor: string;
};

function BlocoInfo({ rotulo, valor }: BlocoInfoProps) {
  return (
    <div>
      {/* exibe o rótulo do parâmetro */}
      <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
        {rotulo}
      </p>

      {/* exibe o valor do parâmetro */}
      <p className="mt-2 font-mono text-sm font-bold text-slate-950">{valor}</p>
    </div>
  );
}