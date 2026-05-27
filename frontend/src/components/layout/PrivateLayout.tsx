import { Outlet } from "react-router-dom";
import { Header } from "./Header";

export function PrivateLayout() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* exibe a navegação da área autenticada */}
      <Header />

      <main>
        {/* exibe a rota privada atual */}
        <Outlet />
      </main>
    </div>
  );
}