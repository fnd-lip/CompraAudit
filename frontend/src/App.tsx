import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { WalletProvider } from "./context/WalletContext";
import { PublicLayout } from "./components/layout/PublicLayout";
import { PrivateLayout } from "./components/layout/PrivateLayout";
import { Loading } from "./components/ui/Loading";
import { useAuth } from "./hooks/useAuth";

import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { NewAudit } from "./pages/NewAudit";
import { History } from "./pages/History";
import { EvidenceDetails } from "./pages/EvidenceDetails";
import { PublicVerification } from "./pages/PublicVerification";
import { Profile } from "./pages/Profile";

function RotaPrivada() {
  const { usuarioLogado, carregando } = useAuth();

  if (carregando) {
    return <Loading texto="Carregando sessão..." />;
  }

  if (!usuarioLogado) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WalletProvider>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Register />} />
              <Route path="/verificar" element={<PublicVerification />} />
            </Route>

            <Route element={<RotaPrivada />}>
              <Route element={<PrivateLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/nova-auditoria" element={<NewAudit />} />
                <Route path="/historico" element={<History />} />
                <Route path="/evidencias/:id" element={<EvidenceDetails />} />
                <Route path="/perfil" element={<Profile />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </WalletProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}