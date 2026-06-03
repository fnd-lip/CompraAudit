import { Router } from "express";
import { listarSugestoesAuditoria } from "../controllers/sugestoesAuditoriaController";

export const sugestoesAuditoriaRoutes = Router();

// rota do feed de contratações recentes que podem exigir auditoria preventiva 
sugestoesAuditoriaRoutes.get(
  "/pncp/sugestoes-auditoria",
  listarSugestoesAuditoria
);