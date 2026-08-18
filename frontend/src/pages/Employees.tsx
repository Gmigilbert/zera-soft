import CrudPage from "../components/CrudPage";

export default function Employees() {
  return (
    <CrudPage
      title="Employees"
      apiPath="/employees"
      columns={[
        { key: "fullName", label: "Name" },
        { key: "jobTitle", label: "Job Title" },
        { key: "department", label: "Department" },
        { key: "status", label: "Status" },
        { key: "baseSalary", label: "Base Salary" },
      ]}
      formFields={[
        { key: "fullName", label: "Full Name" },
        { key: "email", label: "Email" },
        { key: "jobTitle", label: "Job Title" },
        { key: "department", label: "Department" },
        { key: "baseSalary", label: "Base Salary", type: "number" },
      ]}
    />
  );
}