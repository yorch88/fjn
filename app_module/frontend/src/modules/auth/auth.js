const HOST = import.meta.env.VITE_API_HOST;
const PORT = import.meta.env.VITE_API_PORT;
const API = `http://${HOST}:${PORT}`;

export async function logoutRequest() {
  const token = localStorage.getItem("token");

  if (!token) return;

  await fetch(`${API}/auth/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // quitamos el token local de todas formas
  localStorage.removeItem("token");
}
