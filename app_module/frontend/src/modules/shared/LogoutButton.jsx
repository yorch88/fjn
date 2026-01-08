import { useNavigate } from "react-router-dom";
import { API_URL } from "./apiConfig";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      if (token) {
        await fetch(`${API_URL}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch {
      console.warn("Logout backend failed");
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("redirect_after_login");
      navigate("/login");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-red-400 hover:text-red-300"
    >
      Logout
    </button>
  );
}
