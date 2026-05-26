import { Link, useNavigate } from "react-router-dom";
import { RegisterForm } from "../components/auth/RegisterForm";
import { useAuth } from "../hooks/useAuth";

export function Register() {
  const navegar = useNavigate();
  const { cadastrar } = useAuth();

  function criarConta(
    nome: string,
    email: string,
    senha: string,
    enderecoCarteira?: string
  ) {
    cadastrar({
      nome,
      email,
      senha,
      enderecoCarteira,
    });

    navegar("/dashboard");
  }

  return (
    <section className="mx-auto max-w-xl px-6 py-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-center text-2xl font-bold text-slate-950">
          Criar conta no CompraAudit
        </h1>

        <p className="mt-2 text-center text-sm text-slate-600">
          Cadastre-se para registrar evidências de compras públicas e vinculá-las
          à sua carteira blockchain.
        </p>

        <div className="mt-8">
          <RegisterForm onSubmit={criarConta} />
        </div>

        <p className="mt-6 text-center text-sm text-slate-600">
          Já tem conta?{" "}
          <Link to="/login" className="font-semibold text-blue-600">
            Entrar
          </Link>
        </p>
      </div>
    </section>
  );
}