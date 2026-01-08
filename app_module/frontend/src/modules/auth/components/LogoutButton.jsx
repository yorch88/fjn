import { useNavigate } from "react-router-dom";
import { logout } from "../api";

export default function LogoutButton() {
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
    } catch (err) {
      console.warn("Backend logout failed, cleaning local token anyway");
    } finally {
      localStorage.removeItem("token");
      navigate("/", { replace: true });
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-slate-400 hover:text-red-400"
    >
      Logout
    </button>
  );
}
