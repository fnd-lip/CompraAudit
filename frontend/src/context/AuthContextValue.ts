import { createContext } from "react";
import type { DadosCadastro, DadosLogin, Usuario } from "../types/auth";

export type AuthContextData = {
  usuario: Usuario | null;
  usuarioLogado: boolean;
  carregando: boolean;
  entrar: (dadosLogin: DadosLogin) => Promise<void>;
  cadastrar: (dadosCadastro: DadosCadastro) => Promise<void>;
  sair: () => void;
};

export const AuthContext = createContext<AuthContextData | null>(null);