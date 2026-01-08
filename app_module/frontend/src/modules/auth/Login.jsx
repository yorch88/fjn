import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
  e.preventDefault();

  try {
    const HOST = import.meta.env.VITE_API_HOST;
    const PORT = import.meta.env.VITE_API_PORT;
    const API  = `http://${HOST}:${PORT}`;
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json();
      alert("Login falló:\n" + JSON.stringify(err, null, 2));
      return;
    }

    const data = await res.json();

    localStorage.setItem("token", data.access_token);

    alert("Login OK");

    const redirect = localStorage.getItem("redirect_after_login") || "/";
    localStorage.removeItem("redirect_after_login");

    window.location.href = redirect;

  } catch (err) {
    console.error(err);
    alert("Error inesperado en login");
  }
};

  return (
    <div>
      <h1>Sistema Modular</h1>
      <h3>Login</h3>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
