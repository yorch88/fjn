
import { API_URL } from "../shared/apiConfig";
// =========================
// HEADERS
// =========================
function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// =========================
// INVENTORY API
// =========================

export async function getInventory() {
  const res = await fetch(`${API_URL}/inventory/`, {
    headers: getAuthHeaders(),
  });

  // Token inválido o expirado
  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.setItem("redirect_after_login", "/inventory");
    window.location.href = "/login";
    return [];
  }

  if (!res.ok) {
    throw new Error("Failed to fetch inventory");
  }

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function createEquipment(payload) {
  const res = await fetch(`${API_URL}/inventory/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.setItem("redirect_after_login", "/inventory/new");
    window.location.href = "/login";
    return;
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || "Failed to create equipment");
  }

  return res.json();
}

// Implementación simple basada en GET /inventory/
export async function getEquipmentById(id) {
  const list = await getInventory();
  return list.find((item) => item.id === id);
}

export async function updateEquipment(id, payload) {
  const res = await fetch(`${API_URL}/inventory/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.setItem("redirect_after_login", `/inventory/${id}/edit`);
    window.location.href = "/login";
    return;
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || "Failed to update equipment");
  }

  return res.json();
}
export async function getSilverHoursReport(threshold = 50) {
  const HOST = import.meta.env.VITE_API_HOST;
  const PORT = import.meta.env.VITE_API_PORT;
  const API = `http://${HOST}:${PORT}`;

  const token = localStorage.getItem("token");

  const res = await fetch(
    `${API}/inventory/report/silver-hours?threshold=${threshold}`,
    {
      headers: {
        alert: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.setItem("redirect_after_login", "/inventory/silver-hours");
    window.location.href = "/login";
    return [];
  }

  if (!res.ok) {
    throw new Error("Failed to load silver hours report");
  }

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}