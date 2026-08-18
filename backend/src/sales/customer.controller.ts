import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CustomerService } from "./customer.service";
import { TenantScopedRequest } from "../tenancy/tenancy.middleware";

@Controller("customers")
@UseGuards(AuthGuard("jwt"))
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  findAll(@Req() req: TenantScopedRequest) {
    return this.customerService.findAll(req);
  }

  @Post()
  create(@Req() req: TenantScopedRequest, @Body() dto: any) {
    return this.customerService.create(req, dto);
  }

  @Patch(":id")
  update(@Req() req: TenantScopedRequest, @Param("id") id: string, @Body() dto: any) {
    return this.customerService.update(req, id, dto);
  }

  @Delete(":id")
  remove(@Req() req: TenantScopedRequest, @Param("id") id: string) {
    return this.customerService.remove(req, id);
  }
}