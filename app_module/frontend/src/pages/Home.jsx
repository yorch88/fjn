import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const hasToken = !!localStorage.getItem("token");

  function go(path) {
    // si ya hay token, entra al módulo
    // si no hay token, igual navega al módulo (RequireAuth hará el redirect y guardará redirect_after_login)
    navigate(path);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center justify-center gap-6">
      <h1 className="text-2xl font-semibold">Sistema Modular</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
        <button
          className="bg-slate-900 border border-slate-700 rounded-xl p-6 hover:bg-slate-800"
          onClick={() => go("/inventory")}
        >
          Inventory
        </button>

        <button
          className="bg-slate-900 border border-slate-700 rounded-xl p-6 hover:bg-slate-800"
          onClick={() => go("/tickets")}
        >
          Tickets
        </button>

        <button
          className="bg-slate-900 border border-slate-700 rounded-xl p-6 hover:bg-slate-800"
          onClick={() => go("/andon")}
        >
          Andon
        </button>
      </div>
    </div>
  );
}
