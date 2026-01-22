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
// TASKS API
// =========================

export async function getTasks() {
  const res = await fetch(`${API_URL}/tasks/`, {
    headers: getAuthHeaders(),
  });

  // Token inválido o expirado
  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.setItem("redirect_after_login", "/tasks");
    window.location.href = "/login";
    return [];
  }

  if (!res.ok) {
    throw new Error("Failed to fetch tasks");
  }

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

// =========================
// CREATE TASK
// =========================

export async function createTask(payload) {
  const res = await fetch(`${API_URL}/tasks/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.setItem("redirect_after_login", "/tasks/new");
    window.location.href = "/login";
    return;
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || "Failed to create task");
  }

  return res.json();
}

// =========================
// GET TASK BY ID
// =========================

export async function getTaskById(id) {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    headers: getAuthHeaders(),
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    return;
  }

  if (!res.ok) {
    throw new Error("Failed to fetch task");
  }

  return res.json();
}
// =========================
// MOVE TASK (Tracking)
// =========================

export async function moveTask(taskId, payload) {
  const res = await fetch(`${API_URL}/tasks/${taskId}/move`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.setItem(
      "redirect_after_login",
      `/tasks/${taskId}`
    );
    window.location.href = "/login";
    return;
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || "Failed to move task");
  }

  return res.json();
}

// =========================
// ADD COMMENT
// =========================

export async function addTaskComment(taskId, payload) {
  const res = await fetch(`${API_URL}/tasks/${taskId}/comment`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.setItem(
      "redirect_after_login",
      `/tasks/${taskId}`
    );
    window.location.href = "/login";
    return;
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || "Failed to add comment");
  }

  return res.json();
}

// =========================
// CLOSE TASK
// =========================

export async function closeTask(id, payload) {
  const res = await fetch(`${API_URL}/tasks/${id}/close`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    return;
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || "Failed to close task");
  }

  return res.json();
}

