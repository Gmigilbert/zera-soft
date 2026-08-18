import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function Modal({ title, onClose, children }) {
    return (_jsx("div", { onClick: onClose, style: {
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
        }, children: _jsxs("div", { onClick: (e) => e.stopPropagation(), style: {
                background: "white",
                borderRadius: 10,
                padding: 24,
                width: 380,
                boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            }, children: [_jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }, children: [_jsx("h3", { style: { margin: 0 }, children: title }), _jsx("button", { onClick: onClose, style: { border: "none", background: "none", fontSize: 18, cursor: "pointer" }, children: "x" })] }), children] }) }));
}
