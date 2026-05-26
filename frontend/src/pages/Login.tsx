import { Link, useNavigate } from "react-router-dom";
import { LoginForm } from "../components/auth/LoginForm";
import { useAuth } from "../hooks/useAuth";

export function Login() {
  const navegar = useNavigate();
  const { entrar } = useAuth();

  function realizarLogin(email: string, senha: string) {
    entrar({ email, senha });
    navegar("/dashboard");
  }

  return (
    <section className="mx-auto max-w-md px-6 py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-950">Entrar</h1>

        <p className="mt-2 text-sm text-slate-600">
          Acesse sua conta para registrar e acompanhar evidências.
        </p>

        <div className="mt-8">
          <LoginForm onSubmit={realizarLogin} />
        </div>

        <p className="mt-6 text-center text-sm text-slate-600">
          Ainda não tem conta?{" "}
          <Link to="/cadastro" className="font-semibold text-blue-600">
            Criar conta
          </Link>
        </p>
      </div>
    </section>
  );
}