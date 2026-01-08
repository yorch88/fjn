import { logoutRequest } from "../auth/auth";
import { useNavigate } from "react-router-dom";
export default function Layout({ children }) {
    const navigate = useNavigate();
  async function handleLogout() {
    await logoutRequest();
    navigate("/login");
  };
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">

        <h1 className="text-xl font-semibold tracking-tight">
          Sistema Modulars
        </h1>

        <span className="text-xs uppercase tracking-wider text-slate-400">
          Monolito modular · Frontend
        </span>
      </header>

      <main className="flex-1 px-6 py-4">{children}</main>

      <footer className="border-t border-slate-800 px-6 py-3 text-xs text-slate-500">
        Arquitectura monolito modular — extensible (tickets, kanban, andon, inventory)
      </footer>
    </div>
  );
}
