import type { DadosCadastro, DadosLogin, Usuario } from "../types/auth";

const CHAVE_TOKEN = "compraaudit_token";
const CHAVE_USUARIO = "compraaudit_usuario";

export function salvarSessao(usuario: Usuario, token: string) {
  localStorage.setItem(CHAVE_TOKEN, token);
  localStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuario));
}

export function buscarSessaoSalva(): Usuario | null {
  const usuarioSalvo = localStorage.getItem(CHAVE_USUARIO);

  if (!usuarioSalvo) {
    return null;
  }

  return JSON.parse(usuarioSalvo) as Usuario;
}

export function limparSessao() {
  localStorage.removeItem(CHAVE_TOKEN);
  localStorage.removeItem(CHAVE_USUARIO);
}

export function autenticarUsuario(dadosLogin: DadosLogin): Usuario {
  const usuario: Usuario = {
    id: crypto.randomUUID(),
    nome: "Felipe Auditor",
    email: dadosLogin.email,
  };

  salvarSessao(usuario, "token_mvp");

  return usuario;
}

export function cadastrarUsuario(dadosCadastro: DadosCadastro): Usuario {
  const usuario: Usuario = {
    id: crypto.randomUUID(),
    nome: dadosCadastro.nome,
    email: dadosCadastro.email,
    enderecoCarteira: dadosCadastro.enderecoCarteira,
  };

  salvarSessao(usuario, "token_mvp");

  return usuario;
}