import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-10 bg-white p-6 rounded-lg shadow">
      <h1 className="text-xl font-bold text-leaf-700 mb-4">Sign in to FasalAI</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-leaf-600 hover:bg-leaf-700 text-white py-2 rounded disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <p className="text-sm text-gray-500 mt-4 text-center">
        No account?{" "}
        <Link to="/register" className="text-leaf-600 font-medium">
          Create one
        </Link>
      </p>
    </div>
  );
}
