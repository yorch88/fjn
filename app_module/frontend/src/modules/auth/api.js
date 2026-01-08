import { API_BASE_URL } from "../../config/api";
import { getAuthHeaders } from "../shared/authHeaders";

export async function logout() {
  const res = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error("Logout failed");
  }
}
