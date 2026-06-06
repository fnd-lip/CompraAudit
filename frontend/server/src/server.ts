import "dotenv/config";
import cors from "cors";
import express from "express";
import { corsConfig } from "./config/corsConfig";
import { routes } from "./routes";

const app = express();
const porta = Number(process.env.PORT || 3333);

// libera consumo da API pelo frontend local e em "produção" 
app.use(cors(corsConfig));

// permite receber JSON no corpo das requisições 
app.use(express.json());

// rota simples para verificar se a API está online 
app.get("/health", (_request, response) => {
  response.json({
    status: "ok",
    service: "CompraAudit API",
  });
});

// registra as rotas principais da aplicação
app.use(routes);

app.listen(porta, () => {
  console.log(`servidor CompraAudit rodando na porta ${porta}`);
});