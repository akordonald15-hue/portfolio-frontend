// src/Login.jsx
import { useState } from "react";
import api from "./api"; // axios instance

export default function Login({ onSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { username, password });
      const { token } = res.data;

      if (!token) {
        setErr("No token returned");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", token);

      // 🔹 Notify parent to redirect to AdminDashboard
      onSuccess?.();

    } catch (error) {
      setErr(error?.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-4">Admin Login</h3>
      <form onSubmit={handleSubmit}>
        <input
          className="w-full p-3 mb-3 rounded bg-gray-100"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          autoComplete="username"
        />
        <input
          type="password"
          className="w-full p-3 mb-3 rounded bg-gray-100"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoComplete="current-password"
        />
        <button
          disabled={loading}
          className={`w-full p-3 rounded text-white ${loading ? "bg-gray-500" : "bg-gray-900 hover:bg-gray-700"}`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      {err && <p className="mt-3 text-red-500">{err}</p>}
    </div>
  );
}
