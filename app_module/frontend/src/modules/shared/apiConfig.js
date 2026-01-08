const HOST = import.meta.env.VITE_API_HOST;
const PORT = import.meta.env.VITE_API_PORT;
const PROTOCOL = import.meta.env.VITE_API_PROTOCOL || "http";

if (!HOST || !PORT) {
  console.error("❌ API env vars missing");
}

export const API_URL = `${PROTOCOL}://${HOST}:${PORT}`;
