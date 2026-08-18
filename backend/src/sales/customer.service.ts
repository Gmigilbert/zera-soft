import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Customer } from "./customer.entity";
import { TenantScopedRequest } from "../tenancy/tenancy.middleware";

@Injectable()
export class CustomerService {
  private repo(req: TenantScopedRequest): Repository<Customer> {
    return req.tenantDataSource!.getRepository(Customer);
  }

  findAll(req: TenantScopedRequest) {
    return this.repo(req).find({ order: { createdAt: "DESC" } });
  }

  create(req: TenantScopedRequest, dto: Partial<Customer>) {
    const repo = this.repo(req);
    const customer = repo.create(dto);
    return repo.save(customer);
  }

  async update(req: TenantScopedRequest, id: string, dto: Partial<Customer>) {
    const repo = this.repo(req);
    const customer = await repo.findOne({ where: { id } });
    if (!customer) throw new NotFoundException("Customer not found");
    Object.assign(customer, dto);
    return repo.save(customer);
  }

  async remove(req: TenantScopedRequest, id: string) {
    const repo = this.repo(req);
    const customer = await repo.findOne({ where: { id } });
    if (!customer) throw new NotFoundException("Customer not found");
    await repo.softDelete(id);
    return { deleted: true };
  }
}