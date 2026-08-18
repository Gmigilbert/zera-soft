import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useAuth } from "../lib/auth";
export default function Payroll() {
    const { apiFetch } = useAuth();
    const [runs, setRuns] = useState([]);
    const [periodStart, setPeriodStart] = useState("");
    const [periodEnd, setPeriodEnd] = useState("");
    const [error, setError] = useState("");
    async function load() {
        const res = await apiFetch("/payroll/runs");
        const data = await res.json();
        if (res.ok)
            setRuns(data);
    }
    useEffect(() => {
        load();
    }, []);
    async function generate(e) {
        e.preventDefault();
        setError("");
        const res = await apiFetch("/payroll/runs/generate", {
            method: "POST",
            body: JSON.stringify({ periodStart, periodEnd, flatDeductionRate: 0.1 }),
        });
        const data = await res.json();
        if (!res.ok) {
            setError(data.message || "Failed to generate");
            return;
        }
        setPeriodStart("");
        setPeriodEnd("");
        load();
    }
    return (_jsxs("div", { style: { padding: 24 }, children: [_jsx("h2", { children: "Payroll" }), _jsxs("form", { onSubmit: generate, style: { margin: "16px 0", padding: 16, border: "1px solid #ddd", borderRadius: 8, maxWidth: 320 }, children: [_jsx("label", { style: { display: "block", fontSize: 13 }, children: "Period Start" }), _jsx("input", { type: "date", value: periodStart, onChange: (e) => setPeriodStart(e.target.value), style: { width: "100%", padding: 6, marginBottom: 8 } }), _jsx("label", { style: { display: "block", fontSize: 13 }, children: "Period End" }), _jsx("input", { type: "date", value: periodEnd, onChange: (e) => setPeriodEnd(e.target.value), style: { width: "100%", padding: 6, marginBottom: 8 } }), _jsx("button", { type: "submit", children: "Generate Pay Run" })] }), error && _jsx("p", { style: { color: "crimson" }, children: error }), _jsxs("table", { style: { width: "100%", borderCollapse: "collapse" }, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { style: { textAlign: "left", padding: 8, borderBottom: "2px solid #ddd" }, children: "Period" }), _jsx("th", { style: { textAlign: "left", padding: 8, borderBottom: "2px solid #ddd" }, children: "Status" }), _jsx("th", { style: { textAlign: "left", padding: 8, borderBottom: "2px solid #ddd" }, children: "Total Net Pay" })] }) }), _jsx("tbody", { children: runs.map((r) => (_jsxs("tr", { children: [_jsxs("td", { style: { padding: 8, borderBottom: "1px solid #eee" }, children: [r.periodStart, " - ", r.periodEnd] }), _jsx("td", { style: { padding: 8, borderBottom: "1px solid #eee" }, children: r.status }), _jsxs("td", { style: { padding: 8, borderBottom: "1px solid #eee" }, children: ["$", r.totalNetPay] })] }, r.id))) })] })] }));
}
