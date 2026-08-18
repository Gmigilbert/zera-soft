import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FinanceService } from "./finance.service";
import { TenantScopedRequest } from "../tenancy/tenancy.middleware";

@Controller("expenses")
@UseGuards(AuthGuard("jwt"))
export class ExpenseController {
  constructor(private readonly financeService: FinanceService) {}

  @Get()
  findAll(@Req() req: TenantScopedRequest) {
    return this.financeService.findAllExpenses(req);
  }

  @Post()
  create(@Req() req: TenantScopedRequest, @Body() dto: any) {
    return this.financeService.createExpense(req, dto);
  }

  @Patch(":id")
  update(@Req() req: TenantScopedRequest, @Param("id") id: string, @Body() dto: any) {
    return this.financeService.updateExpense(req, id, dto);
  }

  @Delete(":id")
  remove(@Req() req: TenantScopedRequest, @Param("id") id: string) {
    return this.financeService.removeExpense(req, id);
  }
}