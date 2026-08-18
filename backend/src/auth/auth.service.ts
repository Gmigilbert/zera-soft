import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";
import { User } from "../users/user.entity";
import { TenantScopedRequest } from "../tenancy/tenancy.middleware";

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  private userRepo(req: TenantScopedRequest): Repository<User> {
    return req.tenantDataSource!.getRepository(User);
  }

  async register(req: TenantScopedRequest, dto: { email: string; password: string; fullName: string }) {
    const repo = this.userRepo(req);
    const existing = await repo.findOne({ where: { email: dto.email } });
    if (existing) throw new UnauthorizedException("Email already registered");

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = repo.create({
      email: dto.email,
      passwordHash,
      fullName: dto.fullName,
      role: "employee",
    });
    await repo.save(user);
    return this.issueToken(user, req.tenantSlug!);
  }

  async login(req: TenantScopedRequest, dto: { email: string; password: string }) {
    const repo = this.userRepo(req);
    const user = await repo.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException("Invalid credentials");

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException("Invalid credentials");

    return this.issueToken(user, req.tenantSlug!);
  }

  private issueToken(user: User, tenantSlug: string) {
    const payload = { sub: user.id, email: user.email, role: user.role, tenant: tenantSlug };
    return {
      accessToken: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
    };
  }
}
