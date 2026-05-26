type LoadingProps = {
  texto?: string;
};

export function Loading({ texto = "Carregando..." }: LoadingProps) {
  return (
    <div className="flex min-h-[300px] items-center justify-center text-slate-500">
      {texto}
    </div>
  );
}