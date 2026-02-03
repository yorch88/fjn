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
// RECEIPTS
// =========================

export async function getReceipts() {
  const res = await fetch(`${API_URL}/receiving/receipt`, {
    headers: getAuthHeaders(),
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.setItem("redirect_after_login", "/receiving");
    window.location.href = "/login";
    return [];
  }

  if (!res.ok) {
    throw new Error("Failed to fetch receipts");
  }

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}


export async function createReceipt(payload) {
  const res = await fetch(`${API_URL}/receiving/receipt`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.setItem("redirect_after_login", "/receiving/create");
    window.location.href = "/login";
    return;
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || "Failed to create receipt");
  }

  return res.json();
}

// =========================
// PART NUMBERS
// =========================

export async function getParts(receiptId) {
  const res = await fetch(
    `${API_URL}/receiving/receipt/${receiptId}/part`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.setItem(
      "redirect_after_login",
      `/receiving/${receiptId}`
    );
    window.location.href = "/login";
    return [];
  }

  if (!res.ok) {
    throw new Error("Failed to fetch parts");
  }

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}


export async function addPart(receiptId, payload) {
  const res = await fetch(
    `${API_URL}/receiving/receipt/${receiptId}/part`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    }
  );

  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.setItem(
      "redirect_after_login",
      `/receiving/${receiptId}`
    );
    window.location.href = "/login";
    return;
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || "Failed to add part");
  }

  return res.json();
}

// =========================
// RECEIVING ITEMS (mini inventory)
// =========================

export async function addItem(partId, payload) {
  const res = await fetch(
    `${API_URL}/receiving/part/${partId}/item`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    }
  );

  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    return;
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || "Failed to add item");
  }

  return res.json();
}


export async function listItems(partId) {
  const res = await fetch(
    `${API_URL}/receiving/part/${partId}/item`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    return [];
  }

  if (!res.ok) {
    throw new Error("Failed to fetch items");
  }

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

// =========================
// SUMMARY
// =========================

export async function getReceiptSummary(receiptId) {
  const res = await fetch(
    `${API_URL}/receiving/receipt/${receiptId}/summary`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.setItem(
      "redirect_after_login",
      `/receiving/${receiptId}`
    );
    window.location.href = "/login";
    return [];
  }

  if (!res.ok) {
    throw new Error("Failed to fetch receipt summary");
  }

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function updateItem(itemId, payload) {
  const res = await fetch(
    `${API_URL}/receiving/item/${itemId}`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    }
  );

  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    return;
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || "Failed to update item");
  }

  return res.json();
}
