import { Router } from "express";
import {
  consultarContratacaoPncp,
  gerarHashContratacao,
} from "../controllers/pncpController";

export const pncpRoutes = Router();

// consulta por query string; ideal para identificadores PNCP com barra 
pncpRoutes.get("/pncp/contratacoes", consultarContratacaoPncp);

// mantém compatibilidade com identificadores simples usados em testes antigos 
pncpRoutes.get("/pncp/contratacoes/:identificador", consultarContratacaoPncp);

// gera hash para uma contratação já selecionada no feed de sugestões 
pncpRoutes.post("/pncp/contratacoes/hash", gerarHashContratacao);