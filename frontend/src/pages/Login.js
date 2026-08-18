import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useAuth } from "../lib/auth";
export default function Login() {
    const { login } = useAuth();
    const [tenantSlug, setTenantSlug] = useState("acme");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await login(tenantSlug, email, password);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        }
        setLoading(false);
    }
    return (_jsxs("div", { style: { maxWidth: 360, margin: "80px auto", fontFamily: "sans-serif" }, children: [_jsx("h2", { children: "Zera Soft Login" }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsx("input", { placeholder: "Company (tenant)", value: tenantSlug, onChange: (e) => setTenantSlug(e.target.value), style: { width: "100%", padding: 8, marginBottom: 8 } }), _jsx("input", { placeholder: "Email", value: email, onChange: (e) => setEmail(e.target.value), style: { width: "100%", padding: 8, marginBottom: 8 } }), _jsx("input", { placeholder: "Password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), style: { width: "100%", padding: 8, marginBottom: 8 } }), _jsx("button", { type: "submit", disabled: loading, children: loading ? "Logging in..." : "Log in" })] }), error && _jsx("p", { style: { color: "crimson" }, children: error })] }));
}
