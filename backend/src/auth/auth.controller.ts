import { Body, Controller, Post, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { TenantScopedRequest } from "../tenancy/tenancy.middleware";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  register(
    @Req() req: TenantScopedRequest,
    @Body() dto: { email: string; password: string; fullName: string },
  ) {
    return this.authService.register(req, dto);
  }

  @Post("login")
  login(@Req() req: TenantScopedRequest, @Body() dto: { email: string; password: string }) {
    return this.authService.login(req, dto);
  }
}
