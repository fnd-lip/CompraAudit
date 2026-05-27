import { Shield } from "lucide-react";

export function ExplicacaoVerificacao() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        {/* exibe o ícone da explicação */}
        <Shield className="h-5 w-5 text-blue-600" />

        <h2 className="font-mono text-sm font-bold uppercase tracking-[0.25em] text-slate-950">
          como o CompraAudit previne alteração retroativa
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <BlocoExplicacao
          titulo="1. Identidade única"
          texto="Os dados principais da contratação geram um hash determinístico. Uma pequena alteração muda completamente o resultado."
        />

        <BlocoExplicacao
          titulo="2. Prova descentralizada"
          texto="O hash original é registrado em blockchain, criando uma referência pública independente do banco de dados."
        />

        <BlocoExplicacao
          titulo="3. Verificação pública"
          texto="Qualquer pessoa pode comparar a evidência salva com os dados atuais e verificar se continuam compatíveis."
        />
      </div>
    </div>
  );
}

type BlocoExplicacaoProps = {
  titulo: string;
  texto: string;
};

function BlocoExplicacao({ titulo, texto }: BlocoExplicacaoProps) {
  return (
    <div>
      {/* exibe o título da explicação */}
      <h3 className="font-bold text-slate-950">{titulo}</h3>

      {/* exibe o texto da explicação */}
      <p className="mt-2 text-sm leading-7 text-slate-600">{texto}</p>
    </div>
  );
}