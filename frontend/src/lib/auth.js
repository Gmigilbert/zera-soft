import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from "react";
const API_BASE = "http://localhost:3000";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [tenantSlug, setTenantSlug] = useState(null);
    const [user, setUser] = useState(null);
    async function login(slug, email, password) {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Tenant-Id": slug },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok)
            throw new Error(data.message || "Login failed");
        setToken(data.accessToken);
        setTenantSlug(slug);
        setUser(data.user);
    }
    function logout() {
        setToken(null);
        setTenantSlug(null);
        setUser(null);
    }
    async function apiFetch(path, options = {}) {
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
    return (_jsx(AuthContext.Provider, { value: { token, tenantSlug, user, login, logout, apiFetch }, children: children }));
}
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx)
        throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
