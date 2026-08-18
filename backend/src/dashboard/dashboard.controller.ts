import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { DashboardService } from "./dashboard.service";
import { TenantScopedRequest } from "../tenancy/tenancy.middleware";

@Controller("dashboard")
@UseGuards(AuthGuard("jwt"))
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get("overview")
  getOverview(@Req() req: TenantScopedRequest) {
    return this.dashboardService.getOverview(req);
  }
}