import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Tenant } from "./tenant.entity";
import { TenantConnectionService } from "./tenant-connection.service";
import { TenancyMiddleware } from "./tenancy.middleware";
import { TenancyController } from "./tenancy.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Tenant])],
  controllers: [TenancyController],
  providers: [TenantConnectionService],
  exports: [TenantConnectionService],
})
export class TenancyModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenancyMiddleware)
      .exclude({ path: "tenants/signup", method: RequestMethod.POST })
      .forRoutes("*");
  }
}