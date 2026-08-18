import { Injectable } from "@nestjs/common";
import { Employee } from "../hr/employee.entity";
import { Customer } from "../sales/customer.entity";
import { Product } from "../inventory/product.entity";
import { Invoice } from "../finance/invoice.entity";
import { Expense } from "../finance/expense.entity";
import { PayRun } from "../payroll/pay-run.entity";
import { TenantScopedRequest } from "../tenancy/tenancy.middleware";

@Injectable()
export class DashboardService {
  async getOverview(req: TenantScopedRequest) {
    const ds = req.tenantDataSource!;

    const employeeRepo = ds.getRepository(Employee);
    const customerRepo = ds.getRepository(Customer);
    const productRepo = ds.getRepository(Product);
    const invoiceRepo = ds.getRepository(Invoice);
    const expenseRepo = ds.getRepository(Expense);
    const payRunRepo = ds.getRepository(PayRun);

    const [
      employeeCount,
      activeEmployeeCount,
      customerCount,
      productCount,
      invoices,
      expenses,
      payRuns,
    ] = await Promise.all([
      employeeRepo.count(),
      employeeRepo.count({ where: { status: "active" } }),
      customerRepo.count(),
      productRepo.count(),
      invoiceRepo.find(),
      expenseRepo.find(),
      payRunRepo.find(),
    ]);

    const totalInvoiced = invoices.reduce((sum, i) => sum + Number(i.amount), 0);
    const totalPaid = invoices
      .filter((i) => i.status === "paid")
      .reduce((sum, i) => sum + Number(i.amount), 0);
    const totalOutstanding = invoices
      .filter((i) => i.status === "sent" || i.status === "overdue")
      .reduce((sum, i) => sum + Number(i.amount), 0);

    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

    const totalPayroll = payRuns.reduce((sum, p) => sum + Number(p.totalNetPay), 0);

    const lowStockProducts = await productRepo
      .createQueryBuilder("p")
      .where("p.stockQuantity < :threshold", { threshold: 10 })
      .getCount();

    return {
      hr: { totalEmployees: employeeCount, activeEmployees: activeEmployeeCount },
      sales: { totalCustomers: customerCount },
      inventory: { totalProducts: productCount, lowStockProducts },
      finance: { totalInvoiced, totalPaid, totalOutstanding, totalExpenses },
      payroll: { totalPayRuns: payRuns.length, totalNetPayIssued: totalPayroll },
      netPosition: totalPaid - totalExpenses,
    };
  }
}