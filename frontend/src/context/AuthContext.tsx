import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { DadosCadastro, DadosLogin, Usuario } from "../types/auth";
import {
  autenticarUsuario,
  buscarSessaoSalva,
  cadastrarUsuario,
  limparSessao,
} from "../services/authService";
import { AuthContext } from "./AuthContextValue";

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [usuario, setUsuario] = useState<Usuario | null>(() =>
    buscarSessaoSalva()
  );

  function entrar(dadosLogin: DadosLogin) {
    const usuarioAutenticado = autenticarUsuario(dadosLogin);
    setUsuario(usuarioAutenticado);
  }

  function cadastrar(dadosCadastro: DadosCadastro) {
    const usuarioCadastrado = cadastrarUsuario(dadosCadastro);
    setUsuario(usuarioCadastrado);
  }

  function sair() {
    limparSessao();
    setUsuario(null);
  }

  const valorContexto = useMemo(
    () => ({
      usuario,
      usuarioLogado: Boolean(usuario),
      carregando: false,
      entrar,
      cadastrar,
      sair,
    }),
    [usuario]
  );

  return (
    <AuthContext.Provider value={valorContexto}>
      {children}
    </AuthContext.Provider>
  );
}