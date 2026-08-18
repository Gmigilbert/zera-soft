import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { PayrollService } from "./payroll.service";
import { TenantScopedRequest } from "../tenancy/tenancy.middleware";

@Controller("payroll")
@UseGuards(AuthGuard("jwt"))
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Get("runs")
  findAllRuns(@Req() req: TenantScopedRequest) {
    return this.payrollService.findAllPayRuns(req);
  }

  @Get("runs/:id/payslips")
  findPayslips(@Req() req: TenantScopedRequest, @Param("id") id: string) {
    return this.payrollService.findPayslipsForRun(req, id);
  }

  @Post("runs/generate")
  generate(@Req() req: TenantScopedRequest, @Body() dto: any) {
    return this.payrollService.generatePayRun(req, dto);
  }

  @Post("runs/:id/mark-paid")
  markPaid(@Req() req: TenantScopedRequest, @Param("id") id: string) {
    return this.payrollService.markPaid(req, id);
  }
}