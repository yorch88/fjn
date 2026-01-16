import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLocations } from "../api";
import { logoutRequest } from "../../auth/auth";

export default function LocationsList() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function handleLogout() {
    await logoutRequest();
    navigate("/login");
  }

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const data = await getLocations();
      setItems(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <header className="border-b border-slate-800 px-6 py-4 flex justify-between">
        <button
          onClick={handleLogout}
          className="text-sm text-red-400 hover:text-red-200"
        >
          Logout
        </button>

        <h1 className="text-xl font-semibold">Locations</h1>

        <button
          onClick={() => navigate("/locations/create")}
          className="text-sm bg-indigo-600 px-3 py-1 rounded"
        >
          + New
        </button>
      </header>

      <main className="flex-1 px-6 py-6">
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
          {loading ? (
            <div className="text-center py-6">Loading...</div>
          ) : (
            <table className="w-full text-sm">
                <thead className="text-slate-400 border-b border-slate-800">
                <tr>
                    <th className="text-left py-2 px-2">Zone</th>
                    <th className="text-left py-2 px-2">Aisle</th>
                    <th className="text-left py-2 px-2">Rack</th>
                    <th className="text-left py-2 px-2">Level</th>
                    <th className="text-left py-2 px-2">Capacity</th>
                    <th className="text-left py-2 px-2">Status</th>
                </tr>
                </thead>
                    <tbody>
                    {items.map((l) => (
                        <tr
                        key={l.id}
                        className="border-t border-slate-800 hover:bg-slate-800/40"
                        >
                        <td className="py-2 px-2">{l.zone}</td>
                        <td className="py-2 px-2">{l.aisle}</td>
                        <td className="py-2 px-2">{l.rack}</td>
                        <td className="py-2 px-2">{l.level}</td>
                        <td className="py-2 px-2">{l.capacity ?? "-"}</td>

                        <td
                            className={`py-2 px-2 font-semibold ${
                            l.active ? "text-green-400" : "text-red-400"
                            }`}
                        >
                            {l.active ? "ACTIVE" : "DISABLED"}
                        </td>
                        </tr>
                    ))}
                    </tbody>

            </table>
          )}
        </div>
      </main>
    </div>
  );
}