import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  addPart,
  getParts,
  addItem,
  getReceiptSummary,
  listItems,
} from "../api";

import { logoutRequest } from "../../auth/auth";

export default function ReceivingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [parts, setParts] = useState([]);
  const [summary, setSummary] = useState([]);
  const [selectedPart, setSelectedPart] = useState(null);
  const [items, setItems] = useState([]);

  const [partForm, setPartForm] = useState({
    part_number: "",
    expected_qty: "",
    is_high_value: false,
  });

  const [itemForm, setItemForm] = useState({
  serial_number: "",
  asset_tag: "",
  quantity: 1,
  description: "",
});
  // =========================
  // AUTH
  // =========================
  async function handleLogout() {
    await logoutRequest();
    navigate("/login");
  }

  // =========================
  // LOADERS (FETCH API returns plain JSON)
  // =========================

  const loadParts = async () => {
    const data = await getParts(id); // ✅ array
    setParts(Array.isArray(data) ? data : []);
  };

  const loadSummary = async () => {
    const data = await getReceiptSummary(id); // ✅ array
    setSummary(Array.isArray(data) ? data : []);
  };

  const loadItems = async (partId) => {
    if (!partId) return;
    const data = await listItems(partId); // ✅ array
    setItems(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    if (id) {
      loadParts();
      loadSummary();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // =========================
  // ADD PART
  // =========================
  const submitPart = async (e) => {
    e.preventDefault();

    await addPart(id, {
      ...partForm,
      expected_qty: Number(partForm.expected_qty),
    });

    setPartForm({
      part_number: "",
      expected_qty: "",
      is_high_value: false,
    });

    await loadParts();
    await loadSummary();
  };

  // =========================
  // ADD ITEM (serial OR bulk)
  // =========================
  const submitItem = async (e) => {
    e.preventDefault();

    if (!selectedPart) return;

    const serial = itemForm.serial_number.trim();

    const payload = {
    serial_number: serial === "" ? null : serial,
    asset_tag: itemForm.asset_tag?.trim() || null,
    quantity: serial !== "" ? 1 : Number(itemForm.quantity),
    description: itemForm.description?.trim() || null,
    };

    try {
        await addItem(selectedPart.id, payload);
        } catch (err) {
        alert(err.message || "Failed to add item");
        return;
        }

    setItemForm({
    serial_number: "",
    asset_tag: "",
    quantity: 1,
    description: "",
    });

    await loadSummary();
    await loadItems(selectedPart.id);

    const input = document.getElementById("serialInput");
    if (input) input.focus();
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

        <h1 className="text-xl font-semibold tracking-tight">Receiving Detail</h1>

        <button
          onClick={() => navigate("/receiving")}
          className="text-sm text-slate-400 hover:text-slate-200"
        >
          Back
        </button>
      </header>

      {/* CONTENT */}
      <main className="flex-1 px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ADD PART */}
          <form
            onSubmit={submitPart}
            className="bg-slate-900 p-4 rounded border border-slate-800"
          >
            <h2 className="mb-3 font-medium">Add Part Number</h2>

            <input
              placeholder="Part Number"
              value={partForm.part_number}
              onChange={(e) =>
                setPartForm({ ...partForm, part_number: e.target.value })
              }
              required
              className="w-full mb-2 bg-slate-950 border border-slate-700 px-3 py-2 rounded"
            />

            <input
              type="number"
              placeholder="Expected Qty"
              value={partForm.expected_qty}
              onChange={(e) =>
                setPartForm({ ...partForm, expected_qty: e.target.value })
              }
              required
              className="w-full mb-2 bg-slate-950 border border-slate-700 px-3 py-2 rounded"
            />

            <label className="text-xs flex items-center gap-2">
              <input
                type="checkbox"
                checked={partForm.is_high_value}
                onChange={(e) =>
                  setPartForm({ ...partForm, is_high_value: e.target.checked })
                }
              />
              High Value
            </label>

            <button className="mt-3 bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-500">
              Add Part
            </button>
          </form>

          {/* ADD ITEM */}
          {selectedPart ? (
            <form
              onSubmit={submitItem}
              className="bg-slate-900 p-4 rounded border border-slate-800"
            >
              <h2 className="mb-3 font-medium">
                Add Item — {selectedPart.part_number}
              </h2>

              <input
                id="serialInput"
                placeholder="Serial Number (optional)"
                value={itemForm.serial_number}
                onChange={(e) =>
                  setItemForm({ ...itemForm, serial_number: e.target.value })
                }
                className="w-full mb-2 bg-slate-950 border border-slate-700 px-3 py-2 rounded"
              />
            <input
                placeholder="Asset Tag (optional)"
                value={itemForm.asset_tag}
                onChange={(e) =>
                    setItemForm({ ...itemForm, asset_tag: e.target.value })
                }
                className="w-full mb-2 bg-slate-950 border border-slate-700 px-3 py-2 rounded"
                />

            
              <input
                type="number"
                placeholder="Quantity (bulk only)"
                value={itemForm.quantity}
                onChange={(e) =>
                  setItemForm({ ...itemForm, quantity: e.target.value })
                }
                disabled={itemForm.serial_number.trim() !== ""}
                className="w-full mb-2 bg-slate-950 border border-slate-700 px-3 py-2 rounded disabled:opacity-40"
              />

              <input
                placeholder="Description"
                value={itemForm.description}
                onChange={(e) =>
                  setItemForm({ ...itemForm, description: e.target.value })
                }
                className="w-full mb-2 bg-slate-950 border border-slate-700 px-3 py-2 rounded"
              />

              <button className="bg-green-600 px-4 py-2 rounded hover:bg-green-500">
                Add Item
              </button>
            </form>
          ) : (
            <div className="bg-slate-900 p-4 rounded border border-slate-800 text-slate-400 text-sm">
              Select a Part Number below to start adding items.
            </div>
          )}
        </div>

        {/* SUMMARY */}
        <div className="mt-6 bg-slate-900 rounded p-4 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-medium">Receipt Summary</h2>
            <button
              onClick={() => {
                loadParts();
                loadSummary();
                if (selectedPart) loadItems(selectedPart.id);
              }}
              className="text-sm text-slate-400 hover:text-slate-200"
            >
              Refresh
            </button>
          </div>

          {summary.length === 0 ? (
            <div className="text-slate-400 text-sm">No parts yet.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-slate-400">
                <tr>
                  <th className="text-left py-2">Part</th>
                  <th className="text-left">Expected</th>
                  <th className="text-left">Received</th>
                  <th className="text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {summary.map((p) => (
                  <tr key={p.id} className="border-t border-slate-800">
                    <td className="py-2">{p.part_number}</td>
                    <td>{p.expected_qty}</td>
                    <td>{p.received_qty}</td>
                    <td>
                      <button
                        onClick={() => {
                          const part = parts.find((x) => x.id === p.id);
                          if (!part) return;
                          setSelectedPart(part);
                          loadItems(part.id);
                          const input = document.getElementById("serialInput");
                          if (input) input.focus();
                        }}
                        className="text-indigo-400 hover:text-indigo-300"
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* ITEM LIST */}
        {selectedPart && (
          <div className="mt-6 bg-slate-900 rounded p-4 border border-slate-800">
            <h2 className="mb-2 font-medium">
              Items — {selectedPart.part_number}
            </h2>

            {items.length === 0 ? (
              <div className="text-slate-400 text-sm">
                No items yet for this part.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="text-slate-400">
                  <tr>
                    <th className="text-left py-2">Serial</th>
                    <th className="text-left py-2">Asset Tag</th>
                    <th className="text-left">Qty</th>
                    <th className="text-left">Description</th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((i) => (
                    <tr key={i.id} className="border-t border-slate-800">
                      <td className="py-2">{i.serial_number || "-"}</td>
                      <td className="py-2">{i.asset_tag  || "-"}</td>
                      <td>{i.quantity}</td>
                      <td>{i.description || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
