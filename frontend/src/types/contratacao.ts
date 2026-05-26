export type Contratacao = {
  identificador: string;
  orgao: string;
  objeto: string;
  valor: number;
  modalidade: string;
  dataPublicacao: string;
  fonte: string;
  dadosOriginais?: unknown;
};