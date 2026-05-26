import "dotenv/config";
import cors from "cors";
import express from "express";
import { routes } from "./routes";

const app = express();
const porta = Number(process.env.PORT || 3333);

/* libera consumo da api pelo frontend */
app.use(
  cors({
    origin: "*",
  })
);

/* permite receber json no corpo das requisicoes */
app.use(express.json());

/* rota simples para verificar se a api esta online */
app.get("/health", (_request, response) => {
  response.json({
    status: "ok",
    service: "CompraAudit API",
  });
});

/* registra as rotas principais da aplicacao */
app.use(routes);

app.listen(porta, () => {
  console.log(`servidor CompraAudit rodando na porta ${porta}`);
});