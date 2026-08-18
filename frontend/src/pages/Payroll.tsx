import { useEffect, useState } from "react";
import { useAuth } from "../lib/auth";
import Modal from "../components/Modal";

export default function Payroll() {
  const { apiFetch } = useAuth();
  const [runs, setRuns] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(0);
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const res = await apiFetch("/payroll/runs");
    const data = await res.json();
    if (res.ok) setRuns(data);
  }

  useEffect(() => {
    load();
  }, []);

  function openModal() {
    setPeriodStart("");
    setPeriodEnd("");
    setStep(0);
    setError("");
    setShowModal(true);
  }

  async function generate() {
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
    setShowModal(false);
    load();
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Payroll</h2>
        <button onClick={openModal}>+ Generate Pay Run</button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12 }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: 8, borderBottom: "2px solid #ddd" }}>Period</th>
            <th style={{ textAlign: "left", padding: 8, borderBottom: "2px solid #ddd" }}>Status</th>
            <th style={{ textAlign: "left", padding: 8, borderBottom: "2px solid #ddd" }}>Total Net Pay</th>
          </tr>
        </thead>
        <tbody>
          {runs.map((r) => (
            <tr key={r.id}>
              <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>{r.periodStart} - {r.periodEnd}</td>
              <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>{r.status}</td>
              <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>${r.totalNetPay}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <Modal title={`Generate Pay Run ? Step ${step + 1} of 2`} onClose={() => setShowModal(false)}>
          {step === 0 ? (
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>Period Start</label>
              <input
                autoFocus
                type="date"
                value={periodStart}
                onChange={(e) => setPeriodStart(e.target.value)}
                style={{ width: "100%", padding: 8, fontSize: 15 }}
              />
            </div>
          ) : (
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>Period End</label>
              <input
                autoFocus
                type="date"
                value={periodEnd}
                onChange={(e) => setPeriodEnd(e.target.value)}
                style={{ width: "100%", padding: 8, fontSize: 15 }}
              />
            </div>
          )}

          {error && <p style={{ color: "crimson", fontSize: 13 }}>{error}</p>}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
            <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>Back</button>
            {step === 0 ? (
              <button onClick={() => setStep(1)}>Next</button>
            ) : (
              <button onClick={generate}>Generate</button>
            )}
          </div>

          <div style={{ display: "flex", gap: 4, marginTop: 16, justifyContent: "center" }}>
            {[0, 1].map((i) => (
              <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i === step ? "#1a1f2b" : "#ddd" }} />
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}