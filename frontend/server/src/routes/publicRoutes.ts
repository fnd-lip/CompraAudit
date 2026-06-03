import { Router } from "express";
import {
  consultarEvidenciaPublica,
  verificarEvidenciaPublica,
} from "../controllers/publicController";

export const publicRoutes = Router();

//rotas públicas usadas para consulta e verificação sem login 
publicRoutes.get("/public/evidencias/:consulta", consultarEvidenciaPublica);
publicRoutes.get("/public/verificacao/:consulta", verificarEvidenciaPublica);