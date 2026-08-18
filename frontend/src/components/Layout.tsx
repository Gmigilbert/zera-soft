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

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif" }}>
      <div style={{ width: 200, background: "#1a1f2b", color: "white", padding: 16, display: "flex", flexDirection: "column" }}>
        <h3 style={{ marginBottom: 24 }}>Zera Soft</h3>
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === "/"}
            style={({ isActive }) => ({
              color: "white",
              textDecoration: "none",
              padding: "8px 0",
              opacity: isActive ? 1 : 0.7,
              fontWeight: isActive ? 600 : 400,
            })}
          >
            {l.label}
          </NavLink>
        ))}
        <div style={{ marginTop: "auto", fontSize: 13, opacity: 0.8 }}>
          <p>{user?.fullName}</p>
          <p style={{ opacity: 0.6 }}>{user?.role}</p>
          <button onClick={logout} style={{ marginTop: 8 }}>Log out</button>
        </div>
      </div>
      <div style={{ flex: 1, overflow: "auto" }}>
        <Outlet />
      </div>
    </div>
  );
}