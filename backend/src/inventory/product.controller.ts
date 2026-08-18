import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ProductService } from "./product.service";
import { TenantScopedRequest } from "../tenancy/tenancy.middleware";

@Controller("products")
@UseGuards(AuthGuard("jwt"))
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  findAll(@Req() req: TenantScopedRequest) {
    return this.productService.findAll(req);
  }

  @Post()
  create(@Req() req: TenantScopedRequest, @Body() dto: any) {
    return this.productService.create(req, dto);
  }

  @Patch(":id")
  update(@Req() req: TenantScopedRequest, @Param("id") id: string, @Body() dto: any) {
    return this.productService.update(req, id, dto);
  }

  @Delete(":id")
  remove(@Req() req: TenantScopedRequest, @Param("id") id: string) {
    return this.productService.remove(req, id);
  }
}