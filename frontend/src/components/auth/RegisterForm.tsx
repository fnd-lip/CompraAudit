import { useState } from "react";
import { Wallet } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { ConnectWalletButton } from "../wallet/ConnectWalletButton";
import { useWallet } from "../../hooks/useWallet";

type RegisterFormProps = {
  onSubmit: (nome: string, email: string, senha: string, enderecoCarteira?: string) => void;
};

export function RegisterForm({ onSubmit }: RegisterFormProps) {
  const { enderecoCarteira } = useWallet();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  function enviarFormulario() {
    if (senha !== confirmarSenha) {
      alert("As senhas não conferem.");
      return;
    }

    onSubmit(nome, email, senha, enderecoCarteira || undefined);
  }

  return (
    <form className="space-y-5">
      <Input
        label="Nome completo ou instituição"
        placeholder="Ex: Felipe Auditor"
        value={nome}
        onChange={(evento) => setNome(evento.target.value)}
      />

      <Input
        label="E-mail"
        type="email"
        placeholder="seu@email.com"
        value={email}
        onChange={(evento) => setEmail(evento.target.value)}
      />

      <div className="grid gap-5 md:grid-cols-2">
        <Input
          label="Senha"
          type="password"
          placeholder="Sua senha"
          value={senha}
          onChange={(evento) => setSenha(evento.target.value)}
        />

        <Input
          label="Confirmar senha"
          type="password"
          placeholder="Repita a senha"
          value={confirmarSenha}
          onChange={(evento) => setConfirmarSenha(evento.target.value)}
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-center gap-2 font-bold text-slate-950">
          <Wallet size={18} className="text-blue-600" />
          Carteira Blockchain
        </div>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          Conecte sua carteira MetaMask para vincular sua conta e registrar
          evidências on-chain na rede Sepolia.
        </p>

        <div className="mt-5">
          <ConnectWalletButton />
        </div>
      </div>

      <Button type="button" className="w-full" onClick={enviarFormulario}>
        Criar conta
      </Button>
    </form>
  );
}