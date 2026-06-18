import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiCookieAuth } from '@nestjs/swagger';

import { AdminJwtAccessGuard } from './admin-jwt-access.guard';
import { AdminSuperGuard } from './admin-super.guard';

export function AdminJwtAuth() {
  return applyDecorators(
    UseGuards(AdminJwtAccessGuard),
    ApiCookieAuth('adminCookieAuth'),
  );
}

export function AdminSuperAuth() {
  return applyDecorators(
    UseGuards(AdminJwtAccessGuard, AdminSuperGuard),
    ApiCookieAuth('adminCookieAuth'),
  );
}
