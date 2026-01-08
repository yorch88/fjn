import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEquipmentById, updateEquipment } from "../api";

export default function InventoryUpdate() {
  const { id } = useParams(); // se espera ruta tipo /inventory/:id/edit
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const eq = await getEquipmentById(id);
        if (!eq) {
          alert("Equipment not found");
          navigate("/inventory");
          return;
        }

        setForm({
          name: eq.name || "",
          description: eq.description || "",
          serial_number: eq.serial_number || "",
          part_number: eq.part_number || "",
          family: eq.family || "",
          model: eq.model || "",
          grade: eq.grade || "",
          status: eq.status || "",
          consignment_type: eq.consignment_type || "",
          purchaser: eq.purchaser || "",
          current_owner: eq.current_owner || "",
          shipped_by: eq.shipped_by || "",
          usage_hours_limit: eq.usage_hours_limit ?? "",
          received_at: eq.received_at
            ? toLocalInput(eq.received_at)
            : "",
          last_recal_date: eq.last_recal_date
            ? toLocalInput(eq.last_recal_date)
            : "",
          next_recal_due_date: eq.next_recal_due_date
            ? toLocalInput(eq.next_recal_due_date)
            : "",
        });
      } catch (err) {
        alert(err.message);
        navigate("/inventory");
      }
    }

    load();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        ["usage_hours_limit"].includes(name) && value !== ""
          ? Number(value)
          : value === ""
          ? ""
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form) return;

    setLoading(true);

    try {
      const payload = {
        ...form,
        usage_hours_limit:
          form.usage_hours_limit === "" ? null : form.usage_hours_limit,
        received_at: form.received_at
          ? new Date(form.received_at).toISOString()
          : null,
        last_recal_date: form.last_recal_date
          ? new Date(form.last_recal_date).toISOString()
          : null,
        next_recal_due_date: form.next_recal_due_date
          ? new Date(form.next_recal_due_date).toISOString()
          : null,
        reason: reason || null,
      };

      await updateEquipment(id, payload);
      navigate("/inventory");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!form) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">
          Inventory - Update Equipment
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
                Serial Number
              </label>
              <input
                name="serial_number"
                value={form.serial_number}
                onChange={handleChange}
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
              <label className="block text-xs text-slate-400 mb-1">Grade</label>
              <select
                name="grade"
                value={form.grade}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm"
              >
                <option value="">(none)</option>
                <option value="SILVER">SILVER</option>
                <option value="GOLDEN">GOLDEN</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm"
              >
                <option value="">(none)</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="EXCEEDED_LIMIT">EXCEEDED_LIMIT</option>
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
                Usage Hours Limit
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

            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Last Recal Date
              </label>
              <input
                type="datetime-local"
                name="last_recal_date"
                value={form.last_recal_date}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Next Recal Due Date
              </label>
              <input
                type="datetime-local"
                name="next_recal_due_date"
                value={form.next_recal_due_date}
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

          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Reason for change
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm"
              placeholder="Optional explanation for audit/history"
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
              {loading ? "Saving..." : "Update"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

// helper para convertir ISO -> value compatible con input datetime-local
function toLocalInput(isoString) {
  const d = new Date(isoString);
  const pad = (n) => String(n).padStart(2, "0");

  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
