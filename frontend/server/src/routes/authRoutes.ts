import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  buscarUsuarioAtual,
  cadastrarUsuario,
  loginUsuario,
} from "../controllers/authController";

export const authRoutes = Router();

// rotas de autenticação do MVP 
authRoutes.post("/auth/register", cadastrarUsuario);
authRoutes.post("/auth/login", loginUsuario);
authRoutes.get("/auth/me", authMiddleware, buscarUsuarioAtual);