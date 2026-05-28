import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

type TokenPayload = {
  sub: string;
};

export type RequestAutenticada = Request & {
  usuarioId?: string;
};

export function authMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    response.status(401).json({ mensagem: "Token não informado." });
    return;
  }

  const [, token] = authHeader.split(" ");

  try {
    const dados = jwt.verify(
      token,
      process.env.JWT_SECRET || "compraaudit_dev_secret"
    ) as TokenPayload;

    /* salva o id do usuário autenticado na requisição */
    (request as RequestAutenticada).usuarioId = dados.sub;

    next();
  } catch {
    response.status(401).json({ mensagem: "Token inválido." });
  }
}