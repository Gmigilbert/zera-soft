import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useAuth } from "../lib/auth";
import Modal from "./Modal";
export default function CrudPage({ title, apiPath, columns, formFields }) {
    const { apiFetch } = useAuth();
    const [items, setItems] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    async function load() {
        setLoading(true);
        setError("");
        try {
            const res = await apiFetch(apiPath);
            const data = await res.json();
            if (res.ok)
                setItems(data);
            else
                setError(data.message || "Failed to load");
        }
        catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        }
        setLoading(false);
    }
    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiPath]);
    function openModal() {
        setFormData({});
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
        if (isLastStep)
            return;
        setStep((s) => s + 1);
    }
    function back() {
        setStep((s) => Math.max(0, s - 1));
    }
    async function handleSave() {
        setError("");
        try {
            const res = await apiFetch(apiPath, {
                method: "POST",
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || "Failed to save");
                return;
            }
            setShowModal(false);
            load();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        }
    }
    return (_jsxs("div", { style: { padding: 24 }, children: [_jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [_jsx("h2", { children: title }), _jsxs("button", { onClick: openModal, children: ["+ New ", title.slice(0, -1)] })] }), loading ? (_jsx("p", { children: "Loading..." })) : items.length === 0 ? (_jsx("p", { children: "No records yet." })) : (_jsxs("table", { style: { width: "100%", borderCollapse: "collapse", marginTop: 12 }, children: [_jsx("thead", { children: _jsx("tr", { children: columns.map((c) => (_jsx("th", { style: { textAlign: "left", borderBottom: "2px solid #ddd", padding: 8 }, children: c.label }, c.key))) }) }), _jsx("tbody", { children: items.map((item) => (_jsx("tr", { children: columns.map((c) => (_jsx("td", { style: { borderBottom: "1px solid #eee", padding: 8 }, children: String(item[c.key] ?? "") }, c.key))) }, item.id))) })] })), showModal && (_jsxs(Modal, { title: `New ${title.slice(0, -1)} ? Step ${step + 1} of ${formFields.length}`, onClose: closeModal, children: [_jsxs("div", { style: { marginBottom: 16 }, children: [_jsx("label", { style: { display: "block", fontSize: 13, marginBottom: 6 }, children: currentField.label }), _jsx("input", { autoFocus: true, type: currentField.type || "text", value: formData[currentField.key] || "", onChange: (e) => setFormData({ ...formData, [currentField.key]: e.target.value }), style: { width: "100%", padding: 8, fontSize: 15 }, onKeyDown: (e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        isLastStep ? handleSave() : next();
                                    }
                                } })] }), error && _jsx("p", { style: { color: "crimson", fontSize: 13 }, children: error }), _jsxs("div", { style: { display: "flex", justifyContent: "space-between", marginTop: 20 }, children: [_jsx("button", { onClick: back, disabled: step === 0, children: "Back" }), isLastStep ? (_jsx("button", { onClick: handleSave, children: "Save" })) : (_jsx("button", { onClick: next, children: "Next" }))] }), _jsx("div", { style: { display: "flex", gap: 4, marginTop: 16, justifyContent: "center" }, children: formFields.map((_, i) => (_jsx("div", { style: {
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: i === step ? "#1a1f2b" : "#ddd",
                            } }, i))) })] }))] }));
}
