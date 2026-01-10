import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getInventory } from "../api";

import LogoutButton from "../../shared/LogoutButton";
export default function InventoryReports() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getInventory();
        setItems(data);
      } catch (err) {
        console.error(err);
        setItems([]); // seguridad extra
        } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
         <LogoutButton />
        <h1 className="text-xl font-semibold tracking-tight">
          Inventory Reports
        </h1>
        <button
          onClick={() => navigate("/inventory/silver-hours")}
          className="text-sm text-indigo-400 hover:text-indigo-300"
        >
          Silver hours report
        </button>
        <button
          onClick={() => navigate("/inventory/new")}
          className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-md text-sm"
        >
          Create equipment
        </button>
        
      </header>

      <main className="flex-1 px-6 py-4">
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4">
          <table className="w-full text-sm">
            <thead className="text-slate-400">
              <tr>
                <th className="text-left py-2">Name</th>
                <th className="text-left py-2">Serial</th>
                <th className="text-left py-2">Grade</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {items.map((i) => (
                <tr key={i.id} className="border-t border-slate-800">
                  <td className="py-2">{i.name}</td>
                  <td className="py-2">{i.serial_number}</td>
                  <td className="py-2">{i.grade}</td>
                  <td className="py-2">{i.status}</td>

                  <td className="py-2">
                    <button
                      onClick={() => navigate(`/inventory/${i.id}/edit`)}
                      className="text-indigo-400 hover:text-indigo-200 text-xs"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}

              {!items.length && (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-slate-500">
                    No equipment found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
