import { Outlet } from "react-router-dom";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}