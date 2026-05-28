import { Router, type Request } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Prisma } from "./generated/prisma/client";
import type { Evidencia as EvidenciaBanco } from "./generated/prisma/client";
import { prisma } from "./lib/prisma";
import {
  authMiddleware,
  type RequestAutenticada,
} from "./middlewares/authMiddleware";
import { buscarContratacaoPncp } from "./services/pncpService";
import { gerarHash, prepararDadosParaHash } from "./services/hashService";

const routes = Router();

type CriarEvidenciaBody = {
  identificador?: string;
  hashDados?: string;
  hashTransacao?: string;
  enderecoContrato?: string;
  carteiraRegistradora?: string;
  status?: "PENDENTE" | "REGISTRADA" | "COMPATIVEL" | "DIVERGENTE";
  contratacao?: unknown;
};

function gerarToken(usuarioId: string) {
  return jwt.sign(
    { sub: usuarioId },
    process.env.JWT_SECRET || "compraaudit_dev_secret",
    { expiresIn: "7d" }
  );
}

function converterJson(valor: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(valor)) as Prisma.InputJsonValue;
}

function formatarEvidencia(evidencia: EvidenciaBanco) {
  return {
    ...evidencia,
    dataRegistro: evidencia.dataRegistro.toISOString(),
    contratacao: evidencia.contratacao,
  };
}

function obterUsuarioId(request: Request) {
  return (request as RequestAutenticada).usuarioId;
}

function obterParametro(valor: string | string[] | undefined) {
  /* garante que parâmetros de rota sempre sejam tratados como string */
  if (Array.isArray(valor)) {
    return valor[0] ?? "";
  }

  return valor ?? "";
}

routes.get("/health", (_request, response) => {
  response.json({
    status: "ok",
    service: "CompraAudit API",
  });
});

routes.post("/auth/register", async (request, response) => {
  const { nome, email, senha } = request.body as {
    nome?: string;
    email?: string;
    senha?: string;
  };

  if (!nome || !email || !senha) {
    response.status(400).json({ mensagem: "Informe nome, email e senha." });
    return;
  }

  const usuarioExistente = await prisma.usuario.findUnique({
    where: { email },
  });

  if (usuarioExistente) {
    response.status(409).json({ mensagem: "Email já cadastrado." });
    return;
  }

  const senhaHash = await bcrypt.hash(senha, 8);

  const usuario = await prisma.usuario.create({
    data: {
      nome,
      email,
      senhaHash,
    },
  });

  const token = gerarToken(usuario.id);

  response.status(201).json({
    token,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
    },
  });
});

routes.post("/auth/login", async (request, response) => {
  const { email, senha } = request.body as {
    email?: string;
    senha?: string;
  };

  if (!email || !senha) {
    response.status(400).json({ mensagem: "Informe email e senha." });
    return;
  }

  const usuario = await prisma.usuario.findUnique({
    where: { email },
  });

  if (!usuario) {
    response.status(401).json({ mensagem: "Credenciais inválidas." });
    return;
  }

  const senhaConfere = await bcrypt.compare(senha, usuario.senhaHash);

  if (!senhaConfere) {
    response.status(401).json({ mensagem: "Credenciais inválidas." });
    return;
  }

  const token = gerarToken(usuario.id);

  response.json({
    token,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
    },
  });
});

routes.get("/auth/me", authMiddleware, async (request, response) => {
  const usuarioId = obterUsuarioId(request);

  if (!usuarioId) {
    response.status(401).json({ mensagem: "Usuário não autenticado." });
    return;
  }

  const usuario = await prisma.usuario.findUnique({
    where: { id: usuarioId },
  });

  if (!usuario) {
    response.status(404).json({ mensagem: "Usuário não encontrado." });
    return;
  }

  response.json({
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
  });
});

routes.get("/pncp/contratacoes/:identificador", async (request, response) => {
  const identificador = obterParametro(request.params.identificador);

  if (!identificador) {
    response.status(400).json({ mensagem: "Identificador não informado." });
    return;
  }

  const contratacao = await buscarContratacaoPncp(identificador);
  const dadosParaHash = prepararDadosParaHash(contratacao);
  const hashDados = gerarHash(dadosParaHash);

  response.json({
    contratacao,
    dadosParaHash,
    hashDados,
  });
});

routes.post("/evidencias", authMiddleware, async (request, response) => {
  const usuarioId = obterUsuarioId(request);

  if (!usuarioId) {
    response.status(401).json({ mensagem: "Usuário não autenticado." });
    return;
  }

  const {
    identificador,
    hashDados,
    hashTransacao,
    enderecoContrato,
    carteiraRegistradora,
    status,
    contratacao,
  } = request.body as CriarEvidenciaBody;

  if (!identificador || !hashDados || !contratacao) {
    response.status(400).json({
      mensagem: "Informe identificador, hashDados e contratacao.",
    });
    return;
  }

  const evidencia = await prisma.evidencia.create({
    data: {
      usuarioId,
      identificador,
      hashDados,
      hashTransacao,
      enderecoContrato,
      carteiraRegistradora,
      status: status ?? "REGISTRADA",
      contratacao: converterJson(contratacao),
    },
  });

  response.status(201).json(formatarEvidencia(evidencia));
});

routes.get("/evidencias", authMiddleware, async (request, response) => {
  const usuarioId = obterUsuarioId(request);

  if (!usuarioId) {
    response.status(401).json({ mensagem: "Usuário não autenticado." });
    return;
  }

  const evidencias = await prisma.evidencia.findMany({
    where: { usuarioId },
    orderBy: { dataRegistro: "desc" },
  });

  response.json(evidencias.map(formatarEvidencia));
});

routes.get("/evidencias/:id", authMiddleware, async (request, response) => {
  const usuarioId = obterUsuarioId(request);
  const id = obterParametro(request.params.id);

  if (!usuarioId) {
    response.status(401).json({ mensagem: "Usuário não autenticado." });
    return;
  }

  if (!id) {
    response.status(400).json({ mensagem: "ID da evidência não informado." });
    return;
  }

  const evidencia = await prisma.evidencia.findFirst({
    where: {
      id,
      usuarioId,
    },
  });

  if (!evidencia) {
    response.status(404).json({ mensagem: "Evidência não encontrada." });
    return;
  }

  response.json(formatarEvidencia(evidencia));
});

routes.get("/public/evidencias/:consulta", async (request, response) => {
  const consulta = obterParametro(request.params.consulta);

  if (!consulta) {
    response.status(400).json({ mensagem: "Consulta não informada." });
    return;
  }

  const evidencia = await prisma.evidencia.findFirst({
    where: {
      OR: [
        { id: consulta },
        { identificador: consulta },
        { hashDados: consulta },
      ],
    },
    orderBy: { dataRegistro: "desc" },
  });

  if (!evidencia) {
    response.status(404).json({ mensagem: "Evidência não encontrada." });
    return;
  }

  response.json(formatarEvidencia(evidencia));
});

routes.get("/public/verificacao/:consulta", async (request, response) => {
  const consulta = obterParametro(request.params.consulta);

  if (!consulta) {
    response.status(400).json({ mensagem: "Consulta não informada." });
    return;
  }

  const evidencia = await prisma.evidencia.findFirst({
    where: {
      OR: [
        { id: consulta },
        { identificador: consulta },
        { hashDados: consulta },
      ],
    },
    orderBy: { dataRegistro: "desc" },
  });

  if (!evidencia) {
    response.status(404).json({ mensagem: "Evidência não encontrada." });
    return;
  }

  /* consulta novamente os dados atuais da fonte pública */
  const dadosAtuais = await buscarContratacaoPncp(evidencia.identificador);

  /* calcula o hash atual usando os mesmos campos normalizados */
  const dadosParaHashAtual = prepararDadosParaHash(dadosAtuais);
  const hashAtual = gerarHash(dadosParaHashAtual);

  /* compara o hash salvo com o hash calculado agora */
  const status =
    hashAtual === evidencia.hashDados ? "COMPATIVEL" : "DIVERGENTE";

  const mensagem =
    status === "COMPATIVEL"
      ? "Os dados atuais continuam compatíveis com a evidência registrada."
      : "Foi detectada divergência entre os dados atuais e a evidência registrada.";

  response.json({
    status,
    mensagem,
    evidencia: formatarEvidencia(evidencia),
    hashSalvo: evidencia.hashDados,
    hashAtual,
    dadosAtuais,
    dadosParaHashAtual,
  });
});

export { routes };