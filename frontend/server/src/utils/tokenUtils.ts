import jwt from "jsonwebtoken";

// gera o token usado para autenticar o usuário 
export function gerarToken(usuarioId: string) {
  return jwt.sign(
    { sub: usuarioId },
    process.env.JWT_SECRET || "compraaudit_dev_secret",
    { expiresIn: "7d" }
  );
}