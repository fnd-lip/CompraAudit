import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { gerarToken } from "../utils/tokenUtils";
import { obterUsuarioId } from "../utils/requestUtils";

// cadastra um novo usuário no MVP 
export async function cadastrarUsuario(request: Request, response: Response) {
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
}

// autentica usuário usando email e senha 
export async function loginUsuario(request: Request, response: Response) {
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
}

// retorna os dados do usuário autenticado 
export async function buscarUsuarioAtual(request: Request, response: Response) {
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
}