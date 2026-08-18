import { jsx as _jsx } from "react/jsx-runtime";
import CrudPage from "../components/CrudPage";
export default function Products() {
    return (_jsx(CrudPage, { title: "Products", apiPath: "/products", columns: [
            { key: "name", label: "Name" },
            { key: "sku", label: "SKU" },
            { key: "price", label: "Price" },
            { key: "stockQuantity", label: "Stock" },
        ], formFields: [
            { key: "name", label: "Name" },
            { key: "sku", label: "SKU" },
            { key: "price", label: "Price", type: "number" },
            { key: "stockQuantity", label: "Stock Quantity", type: "number" },
        ] }));
}
