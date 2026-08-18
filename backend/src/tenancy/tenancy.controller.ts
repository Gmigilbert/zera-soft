import { Body, Controller, ConflictException, Post } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { TenantConnectionService } from "./tenant-connection.service";
import { User } from "../users/user.entity";

interface SignupDto {
  companyName: string;
  slug: string;
  ownerEmail: string;
  ownerPassword: string;
  ownerFullName: string;
}

@Controller("tenants")
export class TenancyController {
  constructor(private readonly tenantConnections: TenantConnectionService) {}

  @Post("signup")
  async signup(@Body() dto: SignupDto) {
    const slug = dto.slug.trim().toLowerCase();
    if (!/^[a-z0-9-]+$/.test(slug)) {
      throw new ConflictException(
        "Slug must contain only lowercase letters, numbers, and hyphens",
      );
    }

    const existing = await this.tenantConnections
      .resolveTenant(slug)
      .catch(() => null);
    if (existing) {
      throw new ConflictException(`Slug "${slug}" is already taken`);
    }

    const tenant = await this.tenantConnections.provisionSharedSchemaTenant(
      slug,
      dto.companyName,
    );

    const dataSource = await this.tenantConnections.getConnection(tenant);
    const userRepo = dataSource.getRepository(User);

    const passwordHash = await bcrypt.hash(dto.ownerPassword, 10);
    const owner = userRepo.create({
      email: dto.ownerEmail,
      passwordHash,
      fullName: dto.ownerFullName,
      role: "owner",
    });
    await userRepo.save(owner);

    return {
      tenant: { slug: tenant.slug, name: tenant.name },
      owner: { email: owner.email, fullName: owner.fullName, role: owner.role },
      message: "Tenant created. Log in with X-Tenant-Id: " + slug,
    };
  }
}