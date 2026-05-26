export type Usuario = {
  id: string;
  nome: string;
  email: string;
  enderecoCarteira?: string;
};

export type DadosLogin = {
  email: string;
  senha: string;
};

export type DadosCadastro = {
  nome: string;
  email: string;
  senha: string;
  enderecoCarteira?: string;
};