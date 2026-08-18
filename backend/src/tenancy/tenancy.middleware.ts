import { Injectable, NestMiddleware, NotFoundException } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { TenantConnectionService } from "./tenant-connection.service";

export interface TenantScopedRequest extends Request {
  tenantSlug?: string;
  tenantDataSource?: import("typeorm").DataSource;
}

/**
 * Resolves the tenant for every incoming request and attaches a scoped
 * DB connection to it. In production, the tenant slug comes from the
 * subdomain (acme.yourapp.com). In dev, pass an X-Tenant-Id header.
 */
@Injectable()
export class TenancyMiddleware implements NestMiddleware {
  constructor(private readonly tenantConnections: TenantConnectionService) {}

  async use(req: TenantScopedRequest, res: Response, next: NextFunction) {
    const slug = this.extractTenantSlug(req);
    if (!slug) {
      throw new NotFoundException("No tenant specified");
    }

    const tenant = await this.tenantConnections.resolveTenant(slug);
    const dataSource = await this.tenantConnections.getConnection(tenant);

    req.tenantSlug = slug;
    req.tenantDataSource = dataSource;
    next();
  }

  private extractTenantSlug(req: Request): string | undefined {
    const header = req.header("X-Tenant-Id");
    if (header) return header;

    const host = req.hostname; // e.g. acme.yourapp.com
    const parts = host.split(".");
    if (parts.length > 2) return parts[0];

    return undefined;
  }
}
