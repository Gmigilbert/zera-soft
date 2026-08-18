import { jsx as _jsx } from "react/jsx-runtime";
import CrudPage from "../components/CrudPage";
export default function Customers() {
    return (_jsx(CrudPage, { title: "Customers", apiPath: "/customers", columns: [
            { key: "name", label: "Name" },
            { key: "email", label: "Email" },
            { key: "company", label: "Company" },
            { key: "stage", label: "Stage" },
        ], formFields: [
            { key: "name", label: "Name" },
            { key: "email", label: "Email" },
            { key: "company", label: "Company" },
            { key: "phone", label: "Phone" },
        ] }));
}
