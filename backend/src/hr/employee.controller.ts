import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { EmployeeService } from "./employee.service";
import { TenantScopedRequest } from "../tenancy/tenancy.middleware";

@Controller("employees")
@UseGuards(AuthGuard("jwt"))
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  findAll(@Req() req: TenantScopedRequest) {
    return this.employeeService.findAll(req);
  }

  @Post()
  create(@Req() req: TenantScopedRequest, @Body() dto: any) {
    return this.employeeService.create(req, dto);
  }

  @Patch(":id")
  update(@Req() req: TenantScopedRequest, @Param("id") id: string, @Body() dto: any) {
    return this.employeeService.update(req, id, dto);
  }

  @Delete(":id")
  remove(@Req() req: TenantScopedRequest, @Param("id") id: string) {
    return this.employeeService.remove(req, id);
  }
}