import { Router } from "express";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { evidencias, usuarios } from "./data/bancoMemoria";
import {
  authMiddleware,
  type RequestAutenticado,
} from "./middlewares/authMiddleware";
import { buscarContratacaoPncp } from "./services/pncpService";
import { gerarHash, prepararDadosParaHash } from "./services/hashService";
import type { Evidencia, UsuarioPublico } from "./types";

export const routes = Router();

/* remove dados sensiveis antes de retornar o usuario */
function limparUsuario(usuario: {
  id: string;
  nome: string;
  email: string;
  enderecoCarteira?: string;
}): UsuarioPublico {
  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    enderecoCarteira: usuario.enderecoCarteira,
  };
}

/* cria token para sessoes do mvp */
function criarToken(usuarioId: string): string {
  return jwt.sign(
    { sub: usuarioId },
    process.env.JWT_SECRET || "compraaudit_dev_secret",
    { expiresIn: "1d" }
  );
}

routes.post("/auth/register", async (request, response) => {
  const { nome, email, senha, enderecoCarteira } = request.body;

  if (!nome || !email || !senha) {
    response.status(400).json({ mensagem: "Dados obrigatorios ausentes." });
    return;
  }

  const usuarioExiste = usuarios.some((usuario) => usuario.email === email);

  if (usuarioExiste) {
    response.status(409).json({ mensagem: "E-mail ja cadastrado." });
    return;
  }

  const senhaHash = await bcrypt.hash(senha, 8);

  const usuario = {
    id: crypto.randomUUID(),
    nome,
    email,
    senhaHash,
    enderecoCarteira,
  };

  usuarios.push(usuario);

  const token = criarToken(usuario.id);

  response.status(201).json({
    token,
    usuario: limparUsuario(usuario),
  });
});

routes.post("/auth/login", async (request, response) => {
  const { email, senha } = request.body;

  const usuario = usuarios.find((item) => item.email === email);

  if (!usuario) {
    response.status(401).json({ mensagem: "Credenciais invalidas." });
    return;
  }

  const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);

  if (!senhaValida) {
    response.status(401).json({ mensagem: "Credenciais invalidas." });
    return;
  }

  const token = criarToken(usuario.id);

  response.json({
    token,
    usuario: limparUsuario(usuario),
  });
});

routes.get(
  "/auth/me",
  authMiddleware,
  (request: RequestAutenticado, response) => {
    const usuario = usuarios.find((item) => item.id === request.usuarioId);

    if (!usuario) {
      response.status(404).json({ mensagem: "Usuario nao encontrado." });
      return;
    }

    response.json(limparUsuario(usuario));
  }
);

routes.get("/pncp/contratacoes/:identificador", async (request, response) => {
  const { identificador } = request.params;

  const contratacao = await buscarContratacaoPncp(identificador);
  const dadosParaHash = prepararDadosParaHash(contratacao);
  const hashDados = gerarHash(dadosParaHash);

  response.json({
    contratacao,
    hashDados,
    dadosParaHash,
  });
});

routes.post(
  "/evidencias",
  authMiddleware,
  (request: RequestAutenticado, response) => {
    const evidencia: Evidencia = {
      id: crypto.randomUUID(),
      usuarioId: request.usuarioId || "",
      identificador: request.body.identificador,
      hashDados: request.body.hashDados,
      hashTransacao: request.body.hashTransacao,
      enderecoContrato: request.body.enderecoContrato,
      carteiraRegistradora: request.body.carteiraRegistradora,
      dataRegistro: request.body.dataRegistro || new Date().toISOString(),
      status: request.body.status || "REGISTRADA",
      contratacao: request.body.contratacao,
    };

    evidencias.unshift(evidencia);

    response.status(201).json(evidencia);
  }
);

routes.get(
  "/evidencias",
  authMiddleware,
  (request: RequestAutenticado, response) => {
    const minhasEvidencias = evidencias.filter(
      (evidencia) => evidencia.usuarioId === request.usuarioId
    );

    response.json(minhasEvidencias);
  }
);

routes.get(
  "/evidencias/:id",
  authMiddleware,
  (request: RequestAutenticado, response) => {
    const evidencia = evidencias.find(
      (item) =>
        item.id === request.params.id &&
        item.usuarioId === request.usuarioId
    );

    if (!evidencia) {
      response.status(404).json({ mensagem: "Evidencia nao encontrada." });
      return;
    }

    response.json(evidencia);
  }
);

routes.get("/public/evidencias/:consulta", (request, response) => {
  const { consulta } = request.params;

  const evidencia = evidencias.find(
    (item) =>
      item.id === consulta ||
      item.identificador === consulta ||
      item.hashDados === consulta
  );

  if (!evidencia) {
    response.status(404).json({ mensagem: "Evidencia nao encontrada." });
    return;
  }

  response.json(evidencia);
});