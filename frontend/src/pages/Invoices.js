import { jsx as _jsx } from "react/jsx-runtime";
import CrudPage from "../components/CrudPage";
export default function Invoices() {
    return (_jsx(CrudPage, { title: "Invoices", apiPath: "/invoices", columns: [
            { key: "customerName", label: "Customer" },
            { key: "amount", label: "Amount" },
            { key: "status", label: "Status" },
            { key: "dueDate", label: "Due Date" },
        ], formFields: [
            { key: "customerName", label: "Customer Name" },
            { key: "amount", label: "Amount", type: "number" },
            { key: "dueDate", label: "Due Date", type: "date" },
        ] }));
}
