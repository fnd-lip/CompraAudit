import type { Request } from "express";
import type { RequestAutenticada } from "../middlewares/authMiddleware";

// recupera o id do usuário autenticado salvo pelo middleware 
export function obterUsuarioId(request: Request) {
  return (request as RequestAutenticada).usuarioId;
}

// garante que parâmetros de rota sempre sejam tratados como string 
export function obterParametro(valor: string | string[] | undefined) {
  if (Array.isArray(valor)) {
    return valor[0] ?? "";
  }

  return valor ?? "";
}