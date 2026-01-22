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
// DEPARTMENTS API
// =========================

export async function getDepartments() {
  const res = await fetch(`${API_URL}/departments/`, {
    headers: getAuthHeaders(),
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.setItem("redirect_after_login", "/tasks/new");
    window.location.href = "/login";
    return [];
  }

  if (!res.ok) {
    throw new Error("Failed to fetch departments");
  }

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}
