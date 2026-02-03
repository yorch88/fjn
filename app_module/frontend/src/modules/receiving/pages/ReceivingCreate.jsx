import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createReceipt } from "../api";
import { logoutRequest } from "../../auth/auth";

// =========================
// CONSTANT OPTIONS
// =========================

const ORIGIN_OPTIONS = ["N/A", "Vietnam", "El Paso TX", "Material Supplier"];

const DESTINATION_OPTIONS = [
  "Plant 1",
  "Plant 2",
  "Plant 3",
  "Plant 4"
];

export default function ReceivingCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    reference_number: "",
    origin: "N/A",
    destination: "Plant 4",
  });

  const [loading, setLoading] = useState(false);

  // =========================
  // AUTH
  // =========================

  async function handleLogout() {
    await logoutRequest();
    navigate("/login");
  }

  // =========================
  // FORM
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createReceipt(form);
      navigate("/receiving");
    } catch (err) {
      alert(err.message || "Failed to create receipt");
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
      <header className="border-b border-slate-800 px-6 py-4 flex justify-between items-center">

        <button
          onClick={handleLogout}
          className="text-sm text-red-400 hover:text-red-200"
        >
          Logout
        </button>

        <h1 className="text-xl font-semibold tracking-tight">
          Receiving - Create Receipt
        </h1>

        <button
          onClick={() => navigate("/receiving")}
          className="text-sm text-slate-400 hover:text-slate-200"
        >
          Back
        </button>

      </header>

      {/* CONTENT */}
      <main className="flex-1 px-6 py-4">

        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-4"
        >

          {/* Reference Number */}
          <div>
            <label className="text-xs text-slate-400">
              Reference Number *
            </label>

            <input
              name="reference_number"
              value={form.reference_number}
              onChange={handleChange}
              required
              className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Origin Dropdown */}
          <div>
            <label className="text-xs text-slate-400">
              Origin
            </label>

            <select
              name="origin"
              value={form.origin}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2"
            >
              {ORIGIN_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Destination Dropdown */}
          <div>
            <label className="text-xs text-slate-400">
              Destination
            </label>

            <select
              name="destination"
              value={form.destination}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2"
            >
              {DESTINATION_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={() => navigate("/receiving")}
              className="border border-slate-600 px-4 py-2 rounded hover:border-slate-400"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              className="bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-500 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Receipt"}
            </button>

          </div>

        </form>

      </main>
    </div>
  );
}
