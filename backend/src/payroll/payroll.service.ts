import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { PayRun } from "./pay-run.entity";
import { Payslip } from "./payslip.entity";
import { Employee } from "../hr/employee.entity";
import { TenantScopedRequest } from "../tenancy/tenancy.middleware";

@Injectable()
export class PayrollService {
  private payRunRepo(req: TenantScopedRequest): Repository<PayRun> {
    return req.tenantDataSource!.getRepository(PayRun);
  }
  private payslipRepo(req: TenantScopedRequest): Repository<Payslip> {
    return req.tenantDataSource!.getRepository(Payslip);
  }
  private employeeRepo(req: TenantScopedRequest): Repository<Employee> {
    return req.tenantDataSource!.getRepository(Employee);
  }

  findAllPayRuns(req: TenantScopedRequest) {
    return this.payRunRepo(req).find({ order: { createdAt: "DESC" } });
  }

  findPayslipsForRun(req: TenantScopedRequest, payRunId: string) {
    return this.payslipRepo(req).find({ where: { payRunId }, order: { employeeName: "ASC" } });
  }

  /**
   * Generates a draft pay run with one payslip per active employee, based
   * on their baseSalary. Deductions are a flat placeholder rate for now ?
   * real tax withholding is a separate, jurisdiction-specific module.
   */
  async generatePayRun(
    req: TenantScopedRequest,
    dto: { periodStart: string; periodEnd: string; flatDeductionRate?: number },
  ) {
    const employees = await this.employeeRepo(req).find({ where: { status: "active" } });

    const payRun = await this.payRunRepo(req).save(
      this.payRunRepo(req).create({
        periodStart: dto.periodStart,
        periodEnd: dto.periodEnd,
        status: "draft",
      }),
    );

    const rate = dto.flatDeductionRate ?? 0;
    let totalNetPay = 0;

    const payslips = employees.map((emp) => {
      const gross = Number(emp.baseSalary) || 0;
      const deductions = Math.round(gross * rate * 100) / 100;
      const net = gross - deductions;
      totalNetPay += net;
      return this.payslipRepo(req).create({
        payRunId: payRun.id,
        employeeId: emp.id,
        employeeName: emp.fullName,
        grossPay: gross,
        deductions,
        netPay: net,
      });
    });

    await this.payslipRepo(req).save(payslips);

    payRun.totalNetPay = totalNetPay;
    payRun.status = "processed";
    await this.payRunRepo(req).save(payRun);

    return { payRun, payslips };
  }

  async markPaid(req: TenantScopedRequest, payRunId: string) {
    const repo = this.payRunRepo(req);
    const payRun = await repo.findOne({ where: { id: payRunId } });
    if (!payRun) throw new NotFoundException("Pay run not found");
    payRun.status = "paid";
    return repo.save(payRun);
  }
}