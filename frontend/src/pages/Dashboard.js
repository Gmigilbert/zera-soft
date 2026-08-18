import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useAuth } from "../lib/auth";
export default function Dashboard() {
    const { apiFetch } = useAuth();
    const [data, setData] = useState(null);
    const [error, setError] = useState("");
    useEffect(() => {
        apiFetch("/dashboard/overview")
            .then(async (res) => {
            const json = await res.json();
            if (res.ok)
                setData(json);
            else
                setError(json.message || "Failed to load");
        })
            .catch((err) => setError(String(err)));
    }, []);
    if (error)
        return _jsx("div", { style: { padding: 24, color: "crimson" }, children: error });
    if (!data)
        return _jsx("div", { style: { padding: 24 }, children: "Loading..." });
    const cards = [
        { label: "Active Employees", value: data.hr.activeEmployees },
        { label: "Customers", value: data.sales.totalCustomers },
        { label: "Products", value: data.inventory.totalProducts },
        { label: "Low Stock", value: data.inventory.lowStockProducts },
        { label: "Total Invoiced", value: `$${data.finance.totalInvoiced}` },
        { label: "Outstanding", value: `$${data.finance.totalOutstanding}` },
        { label: "Total Expenses", value: `$${data.finance.totalExpenses}` },
        { label: "Payroll Issued", value: `$${data.payroll.totalNetPayIssued}` },
    ];
    return (_jsxs("div", { style: { padding: 24 }, children: [_jsx("h2", { children: "Dashboard" }), _jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 16 }, children: cards.map((c) => (_jsxs("div", { style: { border: "1px solid #ddd", borderRadius: 8, padding: 16 }, children: [_jsx("div", { style: { fontSize: 13, color: "#666" }, children: c.label }), _jsx("div", { style: { fontSize: 24, fontWeight: 700 }, children: c.value })] }, c.label))) })] }));
}
