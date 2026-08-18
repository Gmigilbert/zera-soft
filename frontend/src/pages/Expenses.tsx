import CrudPage from "../components/CrudPage";

export default function Expenses() {
  return (
    <CrudPage
      title="Expenses"
      apiPath="/expenses"
      columns={[
        { key: "description", label: "Description" },
        { key: "amount", label: "Amount" },
        { key: "category", label: "Category" },
        { key: "vendor", label: "Vendor" },
      ]}
      formFields={[
        { key: "description", label: "Description" },
        { key: "amount", label: "Amount", type: "number" },
        { key: "category", label: "Category" },
        { key: "vendor", label: "Vendor" },
      ]}
    />
  );
}