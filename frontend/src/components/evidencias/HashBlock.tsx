import { reduzirHash } from "../../utils/reduceHash";

type HashBlockProps = {
  hash: string;
};

export function HashBlock({ hash }: HashBlockProps) {
  return (
    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
      <p className="text-xs font-bold uppercase tracking-widest text-blue-700">
        Hash gerado
      </p>

      <p className="mt-2 break-all font-mono text-sm text-slate-800">
        {hash || "Nenhum hash gerado ainda."}
      </p>

      {hash && (
        <p className="mt-2 text-xs text-slate-500">Resumo: {reduzirHash(hash)}</p>
      )}
    </div>
  );
}