import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { Tenant } from "./tenant.entity";
import { User } from "../users/user.entity";
import { Employee } from "../hr/employee.entity";
import { Customer } from "../sales/customer.entity";
import { Product } from "../inventory/product.entity";
import { Invoice } from "../finance/invoice.entity";
import { Expense } from "../finance/expense.entity";
import { PayRun } from "../payroll/pay-run.entity";
import { Payslip } from "../payroll/payslip.entity";

const TENANT_ENTITIES = [
  User, Employee, Customer, Product, Invoice, Expense, PayRun, Payslip,
];

@Injectable()
export class TenantConnectionService {
  private connections = new Map<string, DataSource>();

  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepo: Repository<Tenant>,
  ) {}

  async resolveTenant(slug: string): Promise<Tenant> {
    const tenant = await this.tenantRepo.findOne({ where: { slug } });
    if (!tenant) {
      throw new NotFoundException(`Unknown tenant: ${slug}`);
    }
    return tenant;
  }

  async getConnection(tenant: Tenant): Promise<DataSource> {
    const cacheKey = tenant.id;
    const cached = this.connections.get(cacheKey);
    if (cached?.isInitialized) return cached;

    const dataSource =
      tenant.isolationMode === "dedicated_db"
        ? new DataSource({
            type: "postgres",
            host: tenant.dbHost,
            database: tenant.dbName,
            username: tenant.dbUser,
            password: process.env.TENANT_DB_FALLBACK_PASSWORD,
            entities: TENANT_ENTITIES,
            synchronize: false,
          })
        : new DataSource({
            type: "postgres",
            host: process.env.CONTROL_DB_HOST || "localhost",
            port: Number(process.env.CONTROL_DB_PORT) || 5432,
            username: process.env.CONTROL_DB_USER || "ems",
            password: process.env.CONTROL_DB_PASSWORD || "ems_dev_password",
            database: process.env.CONTROL_DB_NAME || "ems",
            schema: tenant.schemaName,
            entities: TENANT_ENTITIES,
            synchronize: true,
          });

    await dataSource.initialize();
    this.connections.set(cacheKey, dataSource);
    return dataSource;
  }

  async provisionSharedSchemaTenant(slug: string, name: string): Promise<Tenant> {
    const schemaName = `tenant_${slug}`;

    await this.tenantRepo.manager.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);

    const tenant = this.tenantRepo.create({
      slug,
      name,
      isolationMode: "shared_schema",
      schemaName,
    });
    await this.tenantRepo.save(tenant);

    await this.getConnection(tenant);
    return tenant;
  }
}