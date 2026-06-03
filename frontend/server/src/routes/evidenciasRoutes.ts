import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  buscarEvidenciaPorId,
  criarEvidencia,
  listarEvidencias,
} from "../controllers/evidenciasController";

export const evidenciasRoutes = Router();

// rotas privadas de evidências off-chain 
evidenciasRoutes.post("/evidencias", authMiddleware, criarEvidencia);
evidenciasRoutes.get("/evidencias", authMiddleware, listarEvidencias);
evidenciasRoutes.get("/evidencias/:id", authMiddleware, buscarEvidenciaPorId);