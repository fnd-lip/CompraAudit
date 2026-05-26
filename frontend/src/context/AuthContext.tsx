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

  const [carregando, setCarregando] = useState(false);

  // realiza login e atualiza o usuario global
  async function entrar(dadosLogin: DadosLogin) {
    setCarregando(true);

    try {
      const usuarioAutenticado = await autenticarUsuario(dadosLogin);
      setUsuario(usuarioAutenticado);
    } finally {
      setCarregando(false);
    }
  }

  // realiza cadastro e atualiza o usuario global 
  async function cadastrar(dadosCadastro: DadosCadastro) {
    setCarregando(true);

    try {
      const usuarioCadastrado = await cadastrarUsuario(dadosCadastro);
      setUsuario(usuarioCadastrado);
    } finally {
      setCarregando(false);
    }
  }

  // encerra a sessao atual 
  function sair() {
    limparSessao();
    setUsuario(null);
  }

  const valorContexto = useMemo(
    () => ({
      usuario,
      usuarioLogado: Boolean(usuario),
      carregando,
      entrar,
      cadastrar,
      sair,
    }),
    [usuario, carregando]
  );

  return (
    <AuthContext.Provider value={valorContexto}>
      {children}
    </AuthContext.Provider>
  );
}