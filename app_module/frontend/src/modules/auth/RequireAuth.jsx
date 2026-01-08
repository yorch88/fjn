import { Navigate, useLocation } from "react-router-dom";

export default function RequireAuth({ children }) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    localStorage.setItem(
      "redirect_after_login",
      location.pathname
    );
    return <Navigate to="/login" replace />;
  }

  return children;
}