import { useState } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

type LoginFormProps = {
  onSubmit: (email: string, senha: string) => void;
};

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function enviarFormulario() {
    onSubmit(email, senha);
  }

  return (
    <form className="space-y-5">
      <Input
        label="E-mail"
        type="email"
        placeholder="seu@email.com"
        value={email}
        onChange={(evento) => setEmail(evento.target.value)}
      />

      <Input
        label="Senha"
        type="password"
        placeholder="Sua senha"
        value={senha}
        onChange={(evento) => setSenha(evento.target.value)}
      />

      <Button type="button" className="w-full" onClick={enviarFormulario}>
        Entrar
      </Button>
    </form>
  );
}