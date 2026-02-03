import { API_URL } from "../shared/apiConfig";
import { getAuthHeaders } from "../shared/authHeaders";

export async function logout() {
  const res = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error("Logout failed");
  }
}
