export function formatarData(data: string): string {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(data));
}