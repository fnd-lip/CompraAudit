import { PageContainer } from "../components/ui/PageContainer";
import { PageHeader } from "../components/ui/PageHeader";
import { useAuth } from "../hooks/useAuth";
import { useWallet } from "../hooks/useWallet";
import { PerfilUsuarioCard } from "../components/perfil/PerfilUsuarioCard";
import { PerfilCarteiraCard } from "../components/perfil/PerfilCarteiraCard";

type UsuarioBasico = {
  nome?: string;
  email?: string;
};

type AuthComUsuario = {
  usuario?: UsuarioBasico | null;
};

type WalletComDesconectar = {
  desconectarCarteira?: () => void;
};

export function Profile() {
  const auth = useAuth();
  const wallet = useWallet();

  const usuario = "usuario" in auth ? (auth as AuthComUsuario).usuario : null;

  const desconectarCarteira =
    "desconectarCarteira" in wallet
      ? (wallet as WalletComDesconectar).desconectarCarteira
      : undefined;

  const nome = usuario?.nome || "Auditor Fiscal Felipe";
  const email = usuario?.email || "felipeisbg@gmail.com";

  return (
    <PageContainer className="space-y-8">
      <PageHeader
        titulo="Perfil do Auditor Público"
        descricao="Gerencie sua conta, confira a carteira conectada e acompanhe os parâmetros usados nos registros on-chain."
      />

      <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
        {/* exibe os dados principais do usuário autenticado */}
        <PerfilUsuarioCard nome={nome} email={email} onSair={auth.sair} />

        {/* exibe os parâmetros da carteira usada nos registros */}
        <PerfilCarteiraCard
          carteiraConectada={wallet.carteiraConectada}
          enderecoCarteira={wallet.enderecoCarteira}
          onConectar={wallet.conectarCarteira}
          onDesconectar={desconectarCarteira}
        />
      </div>
    </PageContainer>
  );
}