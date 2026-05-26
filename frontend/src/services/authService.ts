import { cadastroApi, loginApi } from "../api/authApi";
import type { DadosCadastro, DadosLogin, Usuario } from "../types/auth";

const CHAVE_TOKEN = "compraaudit_token";
const CHAVE_USUARIO = "compraaudit_usuario";

// salva a sessao do usuario no navegador 
export function salvarSessao(usuario: Usuario, token: string) {
  localStorage.setItem(CHAVE_TOKEN, token);
  localStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuario));
}

// busca uma sessao existente no navegador
export function buscarSessaoSalva(): Usuario | null {
  const usuarioSalvo = localStorage.getItem(CHAVE_USUARIO);

  if (!usuarioSalvo) {
    return null;
  }

  return JSON.parse(usuarioSalvo) as Usuario;
}

// remove os dados da sessao local 
export function limparSessao() {
  localStorage.removeItem(CHAVE_TOKEN);
  localStorage.removeItem(CHAVE_USUARIO);
}

// autentica usando o backend 
export async function autenticarUsuario(dadosLogin: DadosLogin): Promise<Usuario> {
  const resposta = await loginApi(dadosLogin);

  salvarSessao(resposta.usuario, resposta.token);

  return resposta.usuario;
}

// cadastra usando o backend 
export async function cadastrarUsuario(
  dadosCadastro: DadosCadastro
): Promise<Usuario> {
  const resposta = await cadastroApi(dadosCadastro);

  salvarSessao(resposta.usuario, resposta.token);

  return resposta.usuario;
}