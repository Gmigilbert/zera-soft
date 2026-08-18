import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Invoice } from "./invoice.entity";
import { Expense } from "./expense.entity";
import { TenantScopedRequest } from "../tenancy/tenancy.middleware";

@Injectable()
export class FinanceService {
  private invoiceRepo(req: TenantScopedRequest): Repository<Invoice> {
    return req.tenantDataSource!.getRepository(Invoice);
  }
  private expenseRepo(req: TenantScopedRequest): Repository<Expense> {
    return req.tenantDataSource!.getRepository(Expense);
  }

  findAllInvoices(req: TenantScopedRequest) {
    return this.invoiceRepo(req).find({ order: { createdAt: "DESC" } });
  }
  createInvoice(req: TenantScopedRequest, dto: Partial<Invoice>) {
    const repo = this.invoiceRepo(req);
    return repo.save(repo.create(dto));
  }
  async updateInvoice(req: TenantScopedRequest, id: string, dto: Partial<Invoice>) {
    const repo = this.invoiceRepo(req);
    const invoice = await repo.findOne({ where: { id } });
    if (!invoice) throw new NotFoundException("Invoice not found");
    Object.assign(invoice, dto);
    return repo.save(invoice);
  }
  async removeInvoice(req: TenantScopedRequest, id: string) {
    const repo = this.invoiceRepo(req);
    const invoice = await repo.findOne({ where: { id } });
    if (!invoice) throw new NotFoundException("Invoice not found");
    await repo.softDelete(id);
    return { deleted: true };
  }

  findAllExpenses(req: TenantScopedRequest) {
    return this.expenseRepo(req).find({ order: { createdAt: "DESC" } });
  }
  createExpense(req: TenantScopedRequest, dto: Partial<Expense>) {
    const repo = this.expenseRepo(req);
    return repo.save(repo.create(dto));
  }
  async updateExpense(req: TenantScopedRequest, id: string, dto: Partial<Expense>) {
    const repo = this.expenseRepo(req);
    const expense = await repo.findOne({ where: { id } });
    if (!expense) throw new NotFoundException("Expense not found");
    Object.assign(expense, dto);
    return repo.save(expense);
  }
  async removeExpense(req: TenantScopedRequest, id: string) {
    const repo = this.expenseRepo(req);
    const expense = await repo.findOne({ where: { id } });
    if (!expense) throw new NotFoundException("Expense not found");
    await repo.softDelete(id);
    return { deleted: true };
  }
}