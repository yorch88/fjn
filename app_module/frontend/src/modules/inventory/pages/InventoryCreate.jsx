import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEquipment } from "../api";
import { logoutRequest } from "../../auth/auth";

export default function InventoryCreate() {
      const navigate = useNavigate();
    
      async function handleLogout() {
        await logoutRequest();
        navigate("/login");
      };

  const [form, setForm] = useState({
    name: "",
    description: "",
    serial_number: "",
    part_number: "",
    family: "",
    model: "",
    grade: "SILVER",
    consignment_type: "",
    purchaser: "",
    current_owner: "",
    shipped_by: "",
    usage_hours_limit: 400,
    received_at: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "usage_hours_limit"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...form,
        usage_hours_limit:
          form.usage_hours_limit === "" ? null : form.usage_hours_limit,
        received_at: form.received_at
          ? new Date(form.received_at).toISOString()
          : null,
      };

      await createEquipment(payload);
      navigate("/inventory"); // volver a reportes
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
                      <button
            onClick={handleLogout}
            className="text-sm text-red-400 hover:text-red-200"
            >
            Logout
        </button>
        <h1 className="text-xl font-semibold tracking-tight">
          Inventory - Create Equipment
        </h1>
        <button
          className="text-sm text-slate-400 hover:text-slate-200"
          onClick={() => navigate("/inventory")}
        >
          Back to reports
        </button>
      </header>

      <main className="flex-1 px-6 py-4">
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Serial Number *
              </label>
              <input
                name="serial_number"
                value={form.serial_number}
                onChange={handleChange}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Part Number
              </label>
              <input
                name="part_number"
                value={form.part_number}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Family</label>
              <input
                name="family"
                value={form.family}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Model</label>
              <input
                name="model"
                value={form.model}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Grade *</label>
              <select
                name="grade"
                value={form.grade}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm"
              >
                <option value="SILVER">SILVER</option>
                <option value="GOLDEN">GOLDEN</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Consignment Type
              </label>
              <input
                name="consignment_type"
                value={form.consignment_type}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Purchaser</label>
              <input
                name="purchaser"
                value={form.purchaser}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Current Owner
              </label>
              <input
                name="current_owner"
                value={form.current_owner}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Shipped By
              </label>
              <input
                name="shipped_by"
                value={form.shipped_by}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Usage Hours Limit (only for SILVER)
              </label>
              <input
                type="number"
                name="usage_hours_limit"
                value={form.usage_hours_limit}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Received At
              </label>
              <input
                type="datetime-local"
                name="received_at"
                value={form.received_at}
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
              onClick={() => navigate("/inventory")}
              className="px-4 py-2 text-sm border border-slate-600 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm bg-indigo-600 rounded-md disabled:opacity-50"
            >
              {loading ? "Saving..." : "Create"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
