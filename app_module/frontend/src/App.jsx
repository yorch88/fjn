import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Login from "./modules/auth/Login.jsx";
import { logoutRequest } from "./modules/auth/auth.js";
import { useNavigate } from "react-router-dom";
import InventoryReports from "./modules/inventory/pages/InventoryReports.jsx";
import InventoryCreate from "./modules/inventory/pages/InventoryCreate.jsx";
import InventoryUpdate from "./modules/inventory/pages/InventoryUpdate.jsx";

export default function App() {
  const navigate = useNavigate();

  async function handleLogout() {
    await logoutRequest();
    navigate("/login");
  };
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center justify-center">
              <button
            onClick={handleLogout}
            className="text-sm text-red-400 hover:text-red-200"
            >
            Logout
        </button>
      <h1 className="text-2xl font-bold mb-8">Sistema Modular</h1>

      <div className="flex gap-6">
        <a href="/inventory" className="px-6 py-3 bg-slate-800 rounded-xl">
          Inventory
        </a>

        <a href="/tickets" className="px-6 py-3 bg-slate-800 rounded-xl">
          Tickets
        </a>

        <a href="/andon" className="px-6 py-3 bg-slate-800 rounded-xl">
          Andon
        </a>
      </div>
    </div>
  );
}