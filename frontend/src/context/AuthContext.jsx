import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("fasalai_token");
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem("fasalai_token"))
      .finally(() => setLoading(false));
  }, []);

  function saveSession({ token, user: nextUser }) {
    localStorage.setItem("fasalai_token", token);
    setUser(nextUser);
  }

  async function login(email, password) {
    const res = await api.post("/auth/login", { email, password });
    saveSession(res.data);
  }

  async function register(name, email, password) {
    const res = await api.post("/auth/register", { name, email, password });
    saveSession(res.data);
  }

  async function loginWithGithub(code) {
    const res = await api.post("/auth/github", { code });
    saveSession(res.data);
  }

  function logout() {
    localStorage.removeItem("fasalai_token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGithub, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

