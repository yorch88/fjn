import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createTask } from "../api";
import { getDepartments } from "../../departments/api";
import { logoutRequest } from "../../auth/auth";

export default function TasksCreate() {
  const navigate = useNavigate();

  // =========================
  // Logout
  // =========================

  async function handleLogout() {
    await logoutRequest();
    navigate("/login");
  }

  // =========================
  // Form State
  // =========================

  const [form, setForm] = useState({
    title: "",
    description: "",
    origin_department_id: "",
    destination_department_id: "",
    current_department_id: "",
    eta_at: "",
  });

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  // =========================
  // Load Departments
  // =========================

  useEffect(() => {
    async function loadDepartments() {
      try {
        const data = await getDepartments();
        setDepartments(data);
      } catch (err) {
        console.error(err);
        setDepartments([]);
      }
    }

    loadDepartments();
  }, []);

  // =========================
  // Form handlers
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // Submit
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title: form.title,
        description: form.description || null,

        origin_department_id: form.origin_department_id || null,
        destination_department_id: form.destination_department_id || null,

        // If current empty, auto use origin
        current_department_id:
          form.current_department_id ||
          form.origin_department_id ||
          null,

        eta_at: form.eta_at
          ? new Date(form.eta_at).toISOString()
          : null,
      };

      await createTask(payload);

      navigate("/task/all");
    } catch (err) {
      alert(err.message || "Error creating task");
    } finally {
      setLoading(false);
    }
  };

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
          Tasks — Create Task
        </h1>

        <button
          className="text-sm text-slate-400 hover:text-slate-200"
          onClick={() => navigate("/task/all")}
        >
          Back to tasks
        </button>
      </header>

      {/* CONTENT */}
      <main className="flex-1 px-6 py-4">
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4"
        >
          {/* BASIC INFO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* TITLE */}
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Title *
              </label>

              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm"
              />
            </div>

            {/* ETA */}
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                ETA (Estimated Completion)
              </label>

              <input
                type="datetime-local"
                name="eta_at"
                value={form.eta_at}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm"
              />
            </div>

            {/* ORIGIN */}
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Origin Department
              </label>

              <select
                name="origin_department_id"
                value={form.origin_department_id}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm"
              >
                <option value="">-- Select department --</option>

                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* DESTINATION */}
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Destination Department
              </label>

              <select
                name="destination_department_id"
                value={form.destination_department_id}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm"
              >
                <option value="">-- Optional --</option>

                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* CURRENT */}
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Current Department
              </label>

              <select
                name="current_department_id"
                value={form.current_department_id}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm"
              >
                <option value="">-- Auto (Origin) --</option>

                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/tasks")}
              className="px-4 py-2 text-sm border border-slate-600 rounded-md"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm bg-indigo-600 rounded-md disabled:opacity-50"
            >
              {loading ? "Saving..." : "Create Task"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
