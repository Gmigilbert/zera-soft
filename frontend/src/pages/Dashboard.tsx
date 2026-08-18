import { useEffect, useState } from "react";
import { useAuth } from "../lib/auth";

export default function Dashboard() {
  const { apiFetch } = useAuth();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/dashboard/overview")
      .then(async (res) => {
        const json = await res.json();
        if (res.ok) setData(json);
        else setError(json.message || "Failed to load");
      })
      .catch((err) => setError(String(err)));
  }, []);

  if (error) return <div style={{ padding: 24, color: "crimson" }}>{error}</div>;
  if (!data) return <div style={{ padding: 24 }}>Loading...</div>;

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

  return (
    <div style={{ padding: 24 }}>
      <h2>Dashboard</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 16 }}>
        {cards.map((c) => (
          <div key={c.label} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16 }}>
            <div style={{ fontSize: 13, color: "#666" }}>{c.label}</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{c.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}