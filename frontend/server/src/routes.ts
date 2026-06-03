import { Router } from "express";
import { authRoutes } from "./routes/authRoutes";
import { pncpRoutes } from "./routes/pncpRoutes";
import { evidenciasRoutes } from "./routes/evidenciasRoutes";
import { publicRoutes } from "./routes/publicRoutes";
import { sugestoesAuditoriaRoutes } from "./routes/sugestoesAuditoriaRoutes";

export const routes = Router();

// registra módulos de rotas 
routes.use(authRoutes);
routes.use(pncpRoutes);
routes.use(evidenciasRoutes);
routes.use(publicRoutes);
routes.use(sugestoesAuditoriaRoutes);