import { useEffect, useState } from "react";
import { getSilverHoursReport } from "../api";
import { useNavigate } from "react-router-dom";
const WARNING_HOURS = 50;

export default function InventorySilverHours() {
  const [threshold, setThreshold] = useState(50);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();  
  async function load() {
    setLoading(true);
    try {
      const data = await getSilverHoursReport(threshold);
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      alert(err.message || "Error loading silver hours report");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function getStatus(hoursRemaining) {
    if (hoursRemaining <= 0) return "EXCEEDED";
    if (hoursRemaining <= WARNING_HOURS) return "WARNING";
    return "OK";
  }

  function getStatusColor(hoursRemaining) {
    if (hoursRemaining <= 0) return "text-red-400";
    if (hoursRemaining <= WARNING_HOURS) return "text-yellow-400";
    return "text-green-400";
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      {/* HEADER */}
      <header className="border-b border-slate-800 px-6 py-4">
        <h1 className="text-xl font-semibold tracking-tight">
          Silver Units – Hours Report
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Warning when ≤ {WARNING_HOURS} hours remaining
        </p>
        <button
          className="text-sm text-slate-400 hover:text-slate-200"
          onClick={() => navigate("/inventory")}
        >
          Back to reports
        </button>
      </header>

      <main className="flex-1 px-6 py-6 space-y-4">
        {/* FILTER */}
        <div className="flex items-end gap-4">
            
          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Threshold (hours remaining)
            </label>
            <input
              type="number"
              min="0"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm w-32"
            />
          </div>

          <button
            onClick={load}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-4 py-2 rounded-md text-sm"
          >
            Apply
          </button>
                  
        </div>

        {/* TABLE */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4">
          {loading ? (
            <div className="text-center py-8 text-slate-400">Loading...</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-slate-400">
                <tr>
                  <th className="text-left py-2">Serial</th>
                  <th className="text-left py-2">Part</th>
                  <th className="text-right py-2">Limit</th>
                  <th className="text-right py-2">Used</th>
                  <th className="text-right py-2">Remaining Hrs.</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>

              <tbody>
                {items.map((i) => {
                    const status = getStatus(i.hours_remaining);
                    const color = getStatusColor(i.hours_remaining);

                    return (
                    <tr
                        key={i.id}
                        className="border-t border-slate-800 hover:bg-slate-900/40"
                    >
                        <td className="py-2">{i.serial_number}</td>
                        <td className="py-2">{i.part_number}</td>
                        <td className="py-2 text-right">{i.usage_hours_limit}</td>
                        <td className="py-2 text-right">
                        {i.hours_used.toFixed(1)}
                        </td>

                        {/* REMAINING HOURS */}
                        <td className={`py-2 text-right font-medium ${color}`}>
                        {i.hours_remaining.toFixed(1)}
                        </td>

                        {/* STATUS */}
                        <td className="py-2">
                        <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            status === "EXCEEDED"
                                ? "bg-red-500/20 text-red-400"
                                : status === "WARNING"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-green-500/20 text-green-400"
                            }`}
                        >
                            {status}
                        </span>
                        </td>
                    </tr>
                    );
                })}

                {!items.length && (
                    <tr>
                    <td colSpan="6" className="text-center py-6 text-slate-500">
                        No silver units matching criteria
                    </td>
                    </tr>
                )}
                </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
