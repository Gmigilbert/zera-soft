import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TenancyModule } from "./tenancy/tenancy.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { HrModule } from "./hr/hr.module";
import { SalesModule } from "./sales/sales.module";
import { InventoryModule } from "./inventory/inventory.module";
import { FinanceModule } from "./finance/finance.module";
import { PayrollModule } from "./payroll/payroll.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { Tenant } from "./tenancy/tenant.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.CONTROL_DB_HOST || "localhost",
      port: Number(process.env.CONTROL_DB_PORT) || 5432,
      username: process.env.CONTROL_DB_USER || "ems",
      password: process.env.CONTROL_DB_PASSWORD || "ems_dev_password",
      database: process.env.CONTROL_DB_NAME || "ems",
      entities: [Tenant],
      synchronize: true,
    }),
    TenancyModule,
    AuthModule,
    UsersModule,
    HrModule,
    SalesModule,
    InventoryModule,
    FinanceModule,
    PayrollModule,
    DashboardModule,
  ],
})
export class AppModule {}