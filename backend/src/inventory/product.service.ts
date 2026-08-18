import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Product } from "./product.entity";
import { TenantScopedRequest } from "../tenancy/tenancy.middleware";

@Injectable()
export class ProductService {
  private repo(req: TenantScopedRequest): Repository<Product> {
    return req.tenantDataSource!.getRepository(Product);
  }

  findAll(req: TenantScopedRequest) {
    return this.repo(req).find({ order: { createdAt: "DESC" } });
  }

  create(req: TenantScopedRequest, dto: Partial<Product>) {
    const repo = this.repo(req);
    const product = repo.create(dto);
    return repo.save(product);
  }

  async update(req: TenantScopedRequest, id: string, dto: Partial<Product>) {
    const repo = this.repo(req);
    const product = await repo.findOne({ where: { id } });
    if (!product) throw new NotFoundException("Product not found");
    Object.assign(product, dto);
    return repo.save(product);
  }

  async remove(req: TenantScopedRequest, id: string) {
    const repo = this.repo(req);
    const product = await repo.findOne({ where: { id } });
    if (!product) throw new NotFoundException("Product not found");
    await repo.softDelete(id);
    return { deleted: true };
  }
}