import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createLocation } from "../api";
import { logoutRequest } from "../../auth/auth";

export default function LocationCreate() {
  const navigate = useNavigate();

  async function handleLogout() {
    await logoutRequest();
    navigate("/login");
  }

  const [form, setForm] = useState({
    zone: "",
    aisle: "",
    rack: "",
    level: "",
    position: "",
    description: "",
    capacity: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "capacity" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...form,
        capacity: form.capacity === "" ? null : form.capacity,
      };

      await createLocation(payload);
      navigate("/locations");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <header className="border-b border-slate-800 px-6 py-4 flex justify-between">
        <button
          onClick={handleLogout}
          className="text-sm text-red-400 hover:text-red-200"
        >
          Logout
        </button>

        <h1 className="text-xl font-semibold">Create Location</h1>

        <button
          onClick={() => navigate("/locations")}
          className="text-sm text-slate-400 hover:text-slate-200"
        >
          Back
        </button>
      </header>

      <main className="flex-1 px-6 py-4">
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            {["zone", "aisle", "rack", "level", "position"].map((f) => (
              <div key={f}>
                <label className="block text-xs text-slate-400 mb-1 capitalize">
                  {f}
                </label>
                <input
                  name={f}
                  value={form[f]}
                  onChange={handleChange}
                  required={f !== "position"}
                  className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm"
                />
              </div>
            ))}

            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Capacity (optional)
              </label>
              <input
                type="number"
                name="capacity"
                value={form.capacity}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>

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

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/locations")}
              className="px-4 py-2 text-sm border border-slate-600 rounded-md"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm bg-indigo-600 rounded-md"
            >
              {loading ? "Saving..." : "Create"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}