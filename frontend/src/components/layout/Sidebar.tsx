import { NavLink } from "react-router-dom";
import { History, LayoutDashboard, PlusCircle, User } from "lucide-react";

const itensMenu = [
  {
    texto: "Dashboard",
    rota: "/dashboard",
    icone: LayoutDashboard,
  },
  {
    texto: "Nova Auditoria",
    rota: "/nova-auditoria",
    icone: PlusCircle,
  },
  {
    texto: "Histórico",
    rota: "/historico",
    icone: History,
  },
  {
    texto: "Perfil",
    rota: "/perfil",
    icone: User,
  },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-72 border-r border-slate-800 bg-slate-950 px-5 py-6 text-white">
      <div className="text-xl font-bold">
        Compra<span className="text-blue-400">Audit</span>
      </div>

      <nav className="mt-10 space-y-2">
        {itensMenu.map((item) => {
          const Icone = item.icone;

          return (
            <NavLink
              key={item.rota}
              to={item.rota}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icone size={18} />
              {item.texto}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}