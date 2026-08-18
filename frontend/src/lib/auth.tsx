import { createContext, useContext, useState, ReactNode } from "react";

const API_BASE = "http://localhost:3000";

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

interface AuthContextValue {
  token: string | null;
  tenantSlug: string | null;
  user: User | null;
  login: (tenantSlug: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  apiFetch: (path: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [tenantSlug, setTenantSlug] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  async function login(slug: string, email: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Tenant-Id": slug },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");
    setToken(data.accessToken);
    setTenantSlug(slug);
    setUser(data.user);
  }

  function logout() {
    setToken(null);
    setTenantSlug(null);
    setUser(null);
  }

  async function apiFetch(path: string, options: RequestInit = {}) {
    return fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "X-Tenant-Id": tenantSlug || "",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });
  }

  return (
    <AuthContext.Provider value={{ token, tenantSlug, user, login, logout, apiFetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}