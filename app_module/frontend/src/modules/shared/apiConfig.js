const API_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_URL) {
  console.error("❌ VITE_API_BASE_URL is missing");
}

export { API_URL };