import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  addPart,
  getParts,
  addItem,
  getReceiptSummary,
  listItems,
  updateItem,
} from "../api";

import { logoutRequest } from "../../auth/auth";

export default function ReceivingDetail() {
  const token = localStorage.getItem("token");
  console.log(JSON.parse(atob(token.split('.')[1])));
  const { id } = useParams();
  const navigate = useNavigate();

  // =========================
  // STATE
  // =========================

  const [parts, setParts] = useState([]);
  const [summary, setSummary] = useState([]);
  const [selectedPart, setSelectedPart] = useState(null);
  const [items, setItems] = useState([]);

  const [editingItemId, setEditingItemId] = useState(null);

  const [editForm, setEditForm] = useState({
    serial_number: "",
    asset_tag: "",
    quantity: 1,
    description: "",
  });

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
  // LOADERS
  // =========================

  const loadParts = async () => {
    const data = await getParts(id);
    setParts(Array.isArray(data) ? data : []);
  };

  const loadSummary = async () => {
    const data = await getReceiptSummary(id);
    setSummary(Array.isArray(data) ? data : []);
  };

  const loadItems = async (partId) => {
    if (!partId) return;
    const data = await listItems(partId);
    setItems(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    if (id) {
      loadParts();
      loadSummary();
    }
  }, [id]);

  // =========================
  // PART
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
  // CREATE ITEM
  // =========================

  const submitItem = async (e) => {
    e.preventDefault();

    if (!selectedPart) return;

    const serial = itemForm.serial_number.trim();

    const payload = {
      serial_number: serial === "" ? null : serial,
      asset_tag: itemForm.asset_tag.trim() || null,
      quantity: serial !== "" ? 1 : Math.max(1, Number(itemForm.quantity) || 1),
      description: itemForm.description.trim() || null,
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

    await loadItems(selectedPart.id);
    await loadSummary();

    const input = document.getElementById("serialInput");
    if (input) input.focus();
  };

  // =========================
  // EDIT ITEM
  // =========================

  const startEditItem = (item) => {
    setEditingItemId(item.id);

    setEditForm({
      serial_number: item.serial_number || "",
      asset_tag: item.asset_tag || "",
      quantity: item.quantity,
      description: item.description || "",
    });
  };

  const cancelEditItem = () => {
    setEditingItemId(null);
  };

  const submitUpdateItem = async (itemId) => {
    try {
      const serial = editForm.serial_number.trim();

      const payload = {
        serial_number: serial === "" ? null : serial,
        asset_tag: editForm.asset_tag.trim() || null,
        quantity:
          serial !== ""
            ? 1
            : Math.max(1, Number(editForm.quantity) || 1),
        description: editForm.description.trim() || null,
      };

      await updateItem(itemId, payload);

      setEditingItemId(null);

      await loadItems(selectedPart.id);
      await loadSummary();
    } catch (err) {
      alert(err.message || "Failed to update item");
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

        <h1 className="text-xl font-semibold">Receiving Detail</h1>

        <button
          onClick={() => navigate("/receiving")}
          className="text-sm text-slate-400 hover:text-slate-200"
        >
          Back
        </button>
      </header>

      <main className="flex-1 px-6 py-4">

        {/* ADD PART + ITEM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* ADD PART */}
          <form
            onSubmit={submitPart}
            onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
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
              onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
              className="bg-slate-900 p-4 rounded border border-slate-800"
            >
              <h2 className="mb-3 font-medium">
                Add Item — {selectedPart.part_number}
              </h2>

              <input
                id="serialInput"
                placeholder="Serial Number (optional)"
                value={itemForm.serial_number}
                onChange={(e) => {
                  const value = e.target.value;

                  setItemForm((prev) => ({
                    ...prev,
                    serial_number: value,
                    quantity: value.trim() !== "" ? 1 : prev.quantity || 1,
                  }));
                }}
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
                disabled={itemForm.serial_number.trim() !== ""}
                onChange={(e) =>
                  setItemForm({
                    ...itemForm,
                    quantity: Math.max(1, Number(e.target.value) || 1),
                  })
                }
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
            <div className="bg-slate-900 p-4 rounded border border-slate-800 text-slate-400">
              Select a Part Number below to start adding items.
            </div>
          )}
        </div>

        {/* SUMMARY */}
        <div className="mt-6 bg-slate-900 rounded p-4 border border-slate-800">
          <h2 className="font-medium mb-2">Receipt Summary</h2>

          <table className="w-full text-sm">
            <thead className="text-slate-400">
              <tr>
                <th>Part</th>
                <th>Expected</th>
                <th>Received</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {summary.map((p) => (
                <tr key={p.id} className="border-t border-slate-800">
                  <td>{p.part_number}</td>
                  <td>{p.expected_qty}</td>
                  <td>{p.received_qty}</td>
                  <td>
                    <button
                      onClick={() => {
                        const part = parts.find((x) => x.id === p.id);
                        if (!part) return;

                        setSelectedPart(part);
                        loadItems(part.id);
                      }}
                      className="text-indigo-400"
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ITEMS LIST */}
        {selectedPart && (
          <div className="mt-6 bg-slate-900 rounded p-4 border border-slate-800">
            <h2 className="mb-2 font-medium">
              Items — {selectedPart.part_number}
            </h2>

            <table className="w-full text-sm">
              <thead className="text-slate-400">
                <tr>
                  <th>Serial</th>
                  <th>Asset</th>
                  <th>Qty</th>
                  <th>Description</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {items.map((i) => {
                  const editing = editingItemId === i.id;

                  return (
                    <tr key={i.id} className="border-t border-slate-800">
                      <td>
                        {editing ? (
                          <input
                            value={editForm.serial_number}
                            onChange={(e) => {
                              const value = e.target.value;

                              setEditForm((prev) => ({
                                ...prev,
                                serial_number: value,
                                quantity:
                                  value.trim() !== "" ? 1 : prev.quantity || 1,
                              }));
                            }}
                            className="bg-slate-950 border px-2 py-1 rounded"
                          />
                        ) : (
                          i.serial_number || "-"
                        )}
                      </td>

                      <td>
                        {editing ? (
                          <input
                            value={editForm.asset_tag}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                asset_tag: e.target.value,
                              })
                            }
                            className="bg-slate-950 border px-2 py-1 rounded"
                          />
                        ) : (
                          i.asset_tag || "-"
                        )}
                      </td>

                      <td>
                        {editing ? (
                          <input
                            type="number"
                            value={editForm.quantity}
                            disabled={editForm.serial_number.trim() !== ""}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                quantity: Math.max(
                                  1,
                                  Number(e.target.value) || 1
                                ),
                              })
                            }
                            className="bg-slate-950 border px-2 py-1 rounded w-20"
                          />
                        ) : (
                          i.quantity
                        )}
                      </td>

                      <td>
                        {editing ? (
                          <input
                            value={editForm.description}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                description: e.target.value,
                              })
                            }
                            className="bg-slate-950 border px-2 py-1 rounded"
                          />
                        ) : (
                          i.description || "-"
                        )}
                      </td>

                      <td className="flex gap-2">
                        {!editing ? (
                          
                          <button
                            onClick={() => startEditItem(i)}
                            className="bg-sky-600 px-3 py-1 rounded"
                          >
                            EDIT
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => submitUpdateItem(i.id)}
                              className="bg-green-600 px-3 py-1 rounded"
                            >
                              UPDATE
                            </button>

                            <button
                              onClick={cancelEditItem}
                              className="bg-red-600 px-3 py-1 rounded"
                            >
                              CANCEL
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
