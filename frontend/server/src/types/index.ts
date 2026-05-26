export type Usuario = {
  id: string;
  nome: string;
  email: string;
  senhaHash: string;
  enderecoCarteira?: string;
};

export type UsuarioPublico = {
  id: string;
  nome: string;
  email: string;
  enderecoCarteira?: string;
};

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

export type Evidencia = {
  id: string;
  usuarioId: string;
  identificador: string;
  hashDados: string;
  hashTransacao?: string;
  enderecoContrato?: string;
  carteiraRegistradora?: string;
  dataRegistro: string;
  status: "PENDENTE" | "REGISTRADA" | "COMPATIVEL" | "DIVERGENTE";
  contratacao: Contratacao;
};