import { API_URL } from "../shared/apiConfig";

export async function logoutRequest() {
  const token = localStorage.getItem("token");

  if (!token) return;

  await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // quitamos el token local de todas formas
  localStorage.removeItem("token");
}
