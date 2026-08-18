import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../lib/auth";
const links = [
    { to: "/", label: "Dashboard" },
    { to: "/employees", label: "Employees" },
    { to: "/customers", label: "Customers" },
    { to: "/products", label: "Products" },
    { to: "/invoices", label: "Invoices" },
    { to: "/expenses", label: "Expenses" },
    { to: "/payroll", label: "Payroll" },
];
export default function Layout() {
    const { user, logout } = useAuth();
    return (_jsxs("div", { style: { display: "flex", height: "100vh", fontFamily: "sans-serif" }, children: [_jsxs("div", { style: { width: 200, background: "#1a1f2b", color: "white", padding: 16, display: "flex", flexDirection: "column" }, children: [_jsx("h3", { style: { marginBottom: 24 }, children: "Zera Soft" }), links.map((l) => (_jsx(NavLink, { to: l.to, end: l.to === "/", style: ({ isActive }) => ({
                            color: "white",
                            textDecoration: "none",
                            padding: "8px 0",
                            opacity: isActive ? 1 : 0.7,
                            fontWeight: isActive ? 600 : 400,
                        }), children: l.label }, l.to))), _jsxs("div", { style: { marginTop: "auto", fontSize: 13, opacity: 0.8 }, children: [_jsx("p", { children: user?.fullName }), _jsx("p", { style: { opacity: 0.6 }, children: user?.role }), _jsx("button", { onClick: logout, style: { marginTop: 8 }, children: "Log out" })] })] }), _jsx("div", { style: { flex: 1, overflow: "auto" }, children: _jsx(Outlet, {}) })] }));
}
