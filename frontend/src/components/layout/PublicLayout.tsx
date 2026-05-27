import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* exibe a navegação pública */}
      <Header />

      <main>
        {/* exibe a rota pública atual */}
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}