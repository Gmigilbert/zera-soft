import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/auth";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Customers from "./pages/Customers";
import Products from "./pages/Products";
import Invoices from "./pages/Invoices";
import Expenses from "./pages/Expenses";
import Payroll from "./pages/Payroll";
function RequireAuth({ children }) {
    const { token } = useAuth();
    if (!token)
        return _jsx(Navigate, { to: "/login", replace: true });
    return _jsx(_Fragment, { children: children });
}
function AppRoutes() {
    const { token } = useAuth();
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: token ? _jsx(Navigate, { to: "/", replace: true }) : _jsx(Login, {}) }), _jsxs(Route, { path: "/", element: _jsx(RequireAuth, { children: _jsx(Layout, {}) }), children: [_jsx(Route, { index: true, element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "employees", element: _jsx(Employees, {}) }), _jsx(Route, { path: "customers", element: _jsx(Customers, {}) }), _jsx(Route, { path: "products", element: _jsx(Products, {}) }), _jsx(Route, { path: "invoices", element: _jsx(Invoices, {}) }), _jsx(Route, { path: "expenses", element: _jsx(Expenses, {}) }), _jsx(Route, { path: "payroll", element: _jsx(Payroll, {}) })] })] }));
}
export default function App() {
    return (_jsx(AuthProvider, { children: _jsx(HashRouter, { children: _jsx(AppRoutes, {}) }) }));
}
