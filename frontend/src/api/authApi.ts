import { apiFetch } from "./api";
import type { DadosCadastro, DadosLogin, Usuario } from "../types/auth";

type RespostaAutenticacao = {
  token: string;
  usuario: Usuario;
};

export function loginApi(dadosLogin: DadosLogin) {
  return apiFetch<RespostaAutenticacao>("/auth/login", {
    method: "POST",
    body: JSON.stringify(dadosLogin),
  });
}

export function cadastroApi(dadosCadastro: DadosCadastro) {
  return apiFetch<RespostaAutenticacao>("/auth/register", {
    method: "POST",
    body: JSON.stringify(dadosCadastro),
  });
}

export function buscarUsuarioAtualApi() {
  return apiFetch<Usuario>("/auth/me");
}