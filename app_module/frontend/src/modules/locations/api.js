import { API_URL } from "../shared/apiConfig";
import { getAuthHeaders } from "../shared/authHeaders";
export async function getLocations() {
  const res = await fetch(`${API_URL}/locations/`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error("Failed to load locations");
  }

  return res.json();
}

export async function createLocation(payload) {
  const res = await fetch(`${API_URL}/locations/`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Create failed");
  }

  return res.json();
}
