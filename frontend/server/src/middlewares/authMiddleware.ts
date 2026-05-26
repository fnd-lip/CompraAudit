import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export type RequestAutenticado = Request & {
  usuarioId?: string;
};

/* valida o token jwt enviado pelo frontend */
export function authMiddleware(
  request: RequestAutenticado,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    response.status(401).json({ mensagem: "Token nao informado." });
    return;
  }

  const [, token] = authHeader.split(" ");

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || "compraaudit_dev_secret"
    ) as { sub: string };

    request.usuarioId = payload.sub;
    next();
  } catch {
    response.status(401).json({ mensagem: "Token invalido." });
  }
}