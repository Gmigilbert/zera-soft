import { useEffect, useState } from "react";
import { useAuth } from "../lib/auth";
import Modal from "./Modal";

export interface Column {
  key: string;
  label: string;
}

export interface FormField {
  key: string;
  label: string;
  type?: "text" | "number" | "date";
}

interface CrudPageProps {
  title: string;
  apiPath: string;
  columns: Column[];
  formFields: FormField[];
}

export default function CrudPage({ title, apiPath, columns, formFields }: CrudPageProps) {
  const { apiFetch } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch(apiPath);
      const data = await res.json();
      if (res.ok) setItems(data);
      else setError(data.message || "Failed to load");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiPath]);

  function openCreateModal() {
    setEditingId(null);
    setFormData({});
    setStep(0);
    setError("");
    setShowModal(true);
  }

  function openEditModal(item: any) {
    setEditingId(item.id);
    const initial: Record<string, string> = {};
    formFields.forEach((f) => {
      initial[f.key] = item[f.key] != null ? String(item[f.key]) : "";
    });
    setFormData(initial);
    setStep(0);
    setError("");
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
  }

  const isLastStep = step === formFields.length - 1;
  const currentField = formFields[step];

  function next() {
    if (!isLastStep) setStep((s) => s + 1);
  }
  function back() {
    setStep((s) => Math.max(0, s - 1));
  }

  async function handleSave() {
    setError("");
    try {
      const res = editingId
        ? await apiFetch(`${apiPath}/${editingId}`, { method: "PATCH", body: JSON.stringify(formData) })
        : await apiFetch(apiPath, { method: "POST", body: JSON.stringify(formData) });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to save");
        return;
      }
      setShowModal(false);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this record? This cannot be undone.")) return;
    try {
      const res = await apiFetch(`${apiPath}/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Failed to delete");
        return;
      }
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>{title}</h2>
        <button onClick={openCreateModal}>+ New {title.slice(0, -1)}</button>
      </div>

      {error && !showModal && <p style={{ color: "crimson" }}>{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <p>No records yet.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12 }}>
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key} style={{ textAlign: "left", borderBottom: "2px solid #ddd", padding: 8 }}>
                  {c.label}
                </th>
              ))}
              <th style={{ borderBottom: "2px solid #ddd", padding: 8 }}></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                {columns.map((c) => (
                  <td key={c.key} style={{ borderBottom: "1px solid #eee", padding: 8 }}>
                    {String(item[c.key] ?? "")}
                  </td>
                ))}
                <td style={{ borderBottom: "1px solid #eee", padding: 8, whiteSpace: "nowrap" }}>
                  <button onClick={() => openEditModal(item)} style={{ marginRight: 6 }}>Edit</button>
                  <button onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <Modal
          title={`${editingId ? "Edit" : "New"} ${title.slice(0, -1)} ? Step ${step + 1} of ${formFields.length}`}
          onClose={closeModal}
        >
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>{currentField.label}</label>
            <input
              autoFocus
              type={currentField.type || "text"}
              value={formData[currentField.key] || ""}
              onChange={(e) => setFormData({ ...formData, [currentField.key]: e.target.value })}
              style={{ width: "100%", padding: 8, fontSize: 15 }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  isLastStep ? handleSave() : next();
                }
              }}
            />
          </div>

          {error && <p style={{ color: "crimson", fontSize: 13 }}>{error}</p>}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
            <button onClick={back} disabled={step === 0}>Back</button>
            {isLastStep ? (
              <button onClick={handleSave}>Save</button>
            ) : (
              <button onClick={next}>Next</button>
            )}
          </div>

          <div style={{ display: "flex", gap: 4, marginTop: 16, justifyContent: "center" }}>
            {formFields.map((_, i) => (
              <div
                key={i}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: i === step ? "#1a1f2b" : "#ddd",
                }}
              />
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}