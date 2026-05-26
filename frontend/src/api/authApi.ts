import { apiFetch } from "./api";
import type { DadosCadastro, DadosLogin, Usuario } from "../types/auth";

type RespostaAutenticacao = {
  token: string;
  usuario: Usuario;
};

// envia credenciais para autenticar o usuario 
export function loginApi(dadosLogin: DadosLogin) {
  return apiFetch<RespostaAutenticacao>("/auth/login", {
    method: "POST",
    body: JSON.stringify(dadosLogin),
  });
}

// envia dados para cadastrar o usuario 
export function cadastroApi(dadosCadastro: DadosCadastro) {
  return apiFetch<RespostaAutenticacao>("/auth/register", {
    method: "POST",
    body: JSON.stringify(dadosCadastro),
  });
}

// busca os dados do usuario autenticado 
export function buscarUsuarioAtualApi() {
  return apiFetch<Usuario>("/auth/me");
}