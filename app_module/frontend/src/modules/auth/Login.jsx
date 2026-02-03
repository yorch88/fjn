import { useState } from "react";
import { API_URL } from "../shared/apiConfig";
import logo from "../../images/logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
  e.preventDefault();

  try {
    setLoading(true);

    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json();
      alert("Login failed:\n" + JSON.stringify(err, null, 2));
      return;
    }

    const data = await res.json();

    // Token
    localStorage.setItem("token", data.access_token);

    // Roles
    localStorage.setItem(
      "user_level",
      JSON.stringify(data.level || [])
    );

    const redirect =
      localStorage.getItem("redirect_after_login") || "/";

    localStorage.removeItem("redirect_after_login");

    window.location.href = redirect;

  } catch (err) {
    console.error(err);
    alert("Unexpected login error");
  } finally {
    setLoading(false);
  }
}


  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative">

      {/* CARD */}
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">

        {/* LOGO */}
        <div className="flex justify-center mb-1">
          <img
            src={logo}
            alt="Foxconn Logo"
            className="
              w-[220px]
              sm:w-[260px]
              
              max-w-full
              h-auto
              object-contain
              drop-shadow-lg
            "
          />
        </div>

        {/* HEADER */}
        <div className="text-center mb-1">
          <h1 className="text-2xl font-bold text-slate-100">
            Support System
          </h1>

          <p className="text-slate-400 text-sm mt-1">
            Sign in to continue
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-4">

          {/* EMAIL */}
          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Email
            </label>

            <input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="
                w-full px-3 py-2 rounded-md
                bg-slate-950 border border-slate-700
                text-slate-100 placeholder-slate-500
                focus:outline-none focus:ring-2 focus:ring-indigo-500
                focus:border-indigo-500
              "
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="
                w-full px-3 py-2 rounded-md
                bg-slate-950 border border-slate-700
                text-slate-100 placeholder-slate-500
                focus:outline-none focus:ring-2 focus:ring-indigo-500
                focus:border-indigo-500
              "
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full mt-4
              bg-indigo-600 hover:bg-indigo-500
              text-white py-2 rounded-md font-medium
              transition
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {loading ? "Signing in..." : "Login"}
          </button>

        </form>
      </div>

      {/* FOOTER */}
      <div className="absolute bottom-4 right-6 text-slate-500 text-xs">
        Developed by{" "}
        <span className="text-slate-300 font-medium">
          T.E. Jorge Villa
        </span>
        {" "} Ver. {" "}
        <span className="text-slate-300 font-medium">
          1.0.1
        </span>
      </div>

    </div>
  );
}
