import type { CorsOptions } from "cors";

// origens autorizadas a consumir a API 
const origensPermitidas = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.FRONTEND_URL,
].filter((origem): origem is string => Boolean(origem));

// valida se a origem da requisição pode acessar a API 
function validarOrigem(
  origin: string | undefined,
  callback: (erro: Error | null, permitir?: boolean) => void,
) {
  if (!origin) {
    callback(null, true);
    return;
  }

  if (origensPermitidas.includes(origin)) {
    callback(null, true);
    return;
  }

  callback(new Error(`Origem não permitida pelo CORS: ${origin}`));
}

export const corsConfig: CorsOptions = {
  origin: validarOrigem,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};