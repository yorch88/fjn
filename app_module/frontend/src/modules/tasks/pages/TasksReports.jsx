import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTasks, closeTask } from "../api";

import LogoutButton from "../../shared/LogoutButton";
import { formatMXTime } from "../../../utils/formatMXTime";

export default function TasksReports() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      console.error(err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);


function getStatusColor(task) {
  if (task.status === "closed") {
      return "bg-green-600 text-white";
    }

    if (task.status === "open" && task.is_delayed) {
      return "bg-red-600 text-white";
    }

    if (task.status === "open") {
      return "bg-yellow-400 text-black";
    }

    return "";
  }
  // ======================
  // CLOSE TASK (WITH COMMENT)
  // ======================

  async function handleClose(taskId) {
    const comment = prompt("Close reason:");

    if (comment === null) return;

    try {
      await closeTask(taskId, { comment });
      load();
    } catch (err) {
      alert(err.message);
    }
  }

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
          Tasks Administration
        </h1>

        <button
          onClick={() => navigate("/task/create")}
          className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-md text-sm"
        >
          Create Task
        </button>
      </header>

      <main className="flex-1 px-6 py-4">
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4">
          <table className="w-full text-sm">
            <thead className="text-slate-400">
              <tr>
                <th className="text-left py-2">Title</th>
                <th className="text-left py-2">Created</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">ETA</th>
                <th className="text-left py-2">Delayed</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {tasks.map((t) => (
                <tr key={t.id} className="border-t border-slate-800">
                  <td className="py-2">{t.title}</td>
                  <td className="py-2">
                    {formatMXTime(t.created_at)}
                  </td>

                  <td className="py-2">
                    <span
                      className={`px-3 py-1 rounded-md text-xs font-semibold ${getStatusColor(t)}`}
                    >
                      {t.status.toUpperCase()}
                    </span>
                  </td>

                  <td className="py-2">
                    {formatMXTime(t.eta_at)}
                  </td>

                  <td
                    className={`py-2 ${
                      t.is_delayed
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    {t.is_delayed ? "YES" : "NO"}
                  </td>

                  <td className="py-2 space-x-3">
                    <button
                      onClick={() => navigate(`/tasks/${t.id}`)}
                      className="text-indigo-400 hover:text-indigo-200 text-xs"
                    >
                      View
                    </button>

                    {t.status !== "closed" && (
                      <button
                        onClick={() => handleClose(t.id)}
                        className="text-red-400 hover:text-red-300 text-xs"
                      >
                        Close
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {!tasks.length && (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-slate-500">
                    No tasks found
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
