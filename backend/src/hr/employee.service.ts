import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Employee } from "./employee.entity";
import { TenantScopedRequest } from "../tenancy/tenancy.middleware";

@Injectable()
export class EmployeeService {
  private repo(req: TenantScopedRequest): Repository<Employee> {
    return req.tenantDataSource!.getRepository(Employee);
  }

  findAll(req: TenantScopedRequest) {
    return this.repo(req).find({ order: { createdAt: "DESC" } });
  }

  create(req: TenantScopedRequest, dto: Partial<Employee>) {
    const repo = this.repo(req);
    const employee = repo.create(dto);
    return repo.save(employee);
  }

  async update(req: TenantScopedRequest, id: string, dto: Partial<Employee>) {
    const repo = this.repo(req);
    const employee = await repo.findOne({ where: { id } });
    if (!employee) throw new NotFoundException("Employee not found");
    Object.assign(employee, dto);
    return repo.save(employee);
  }

  async remove(req: TenantScopedRequest, id: string) {
    const repo = this.repo(req);
    const employee = await repo.findOne({ where: { id } });
    if (!employee) throw new NotFoundException("Employee not found");
    await repo.softDelete(id);
    return { deleted: true };
  }
}