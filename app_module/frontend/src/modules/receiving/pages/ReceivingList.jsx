import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getReceipts } from "../api";
import { logoutRequest } from "../../auth/auth";

export default function ReceivingList() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  // =========================
  // AUTH
  // =========================

  async function handleLogout() {
    await logoutRequest();
    navigate("/login");
  }

  // =========================
  // LOAD DATA
  // =========================

  async function load() {
    setLoading(true);

    try {
      const data = await getReceipts();
      setItems(data);
    } catch (err) {
      alert(err.message || "Failed to load receipts");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // =========================
  // FILTER
  // =========================

  const filteredItems = items.filter((r) => {
    const q = filter.toLowerCase();

    return (
      r.reference_number?.toLowerCase().includes(q) ||
      r.origin?.toLowerCase().includes(q) ||
      r.destination?.toLowerCase().includes(q) ||
      r.status?.toLowerCase().includes(q)
    );
  });

  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">

      {/* HEADER */}
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">

        <button
          onClick={handleLogout}
          className="text-sm text-red-400 hover:text-red-200"
        >
          Logout
        </button>

        <h1 className="text-xl font-semibold tracking-tight">
          Receiving - Material
        </h1>

        <div className="flex gap-2">
          <button
            className="px-3 py-1 text-sm bg-indigo-600 rounded-md hover:bg-indigo-500"
            onClick={() => navigate("/receiving/create")}
          >
            Create Receipt
          </button>
        </div>

      </header>

      {/* CONTENT */}
      <main className="flex-1 px-6 py-4">

        {/* SEARCH */}
        <div className="max-w-5xl mx-auto mb-3 flex justify-between items-center">

          <input
            placeholder="Search reference, origin, destination, status..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded px-3 py-1 text-sm w-72 focus:outline-none focus:border-indigo-500"
          />

          <button
            onClick={load}
            className="text-sm text-slate-400 hover:text-slate-200"
          >
            Refresh
          </button>

        </div>

        {/* TABLE */}
        <div className="max-w-5xl mx-auto bg-slate-900/70 border border-slate-800 rounded-2xl p-6">

          <h2 className="font-medium mb-4">
            Receiving Receipts
          </h2>

          {loading ? (
            <div className="text-slate-400 text-sm">
              Loading...
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-slate-400 text-sm">
              No receipts found.
            </div>
          ) : (
            <table className="w-full text-sm">

              <thead className="text-slate-400 border-b border-slate-800">
                <tr className="text-left">
                  <th className="py-2">Reference</th>
                  <th>Origin</th>
                  <th>Destination</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredItems.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t border-slate-800 hover:bg-slate-800/40 transition"
                  >

                    <td className="py-2">
                      {r.reference_number}
                    </td>

                    <td>{r.origin}</td>

                    <td>{r.destination}</td>

                    <td>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          r.status === "OPEN"
                            ? "bg-yellow-500/20 text-yellow-300"
                            : "bg-green-500/20 text-green-300"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>

                    <td className="text-right">
                      <div className="flex justify-end gap-3">

                        <button
                          onClick={() => navigate(`/receiving/${r.id}`)}
                          className="text-indigo-400 hover:text-indigo-300"
                        >
                          View Details
                        </button>

                        <button
                          onClick={() => navigate(`/receiving/${r.id}`)}
                          className="text-green-400 hover:text-green-300"
                        >
                          Add Items
                        </button>

                      </div>
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
