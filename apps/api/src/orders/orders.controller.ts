import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { JwtAccessUser } from '../auth/jwt/jwt-access.strategy';
import {
  COMMON_ERRORS,
  ORDER_ERRORS,
  SERVICE_ERRORS,
} from '../common/constants/errors';
import { ApiErrorResponse } from '../common/decorators/api-error-response.decorator';
import { ApiSuccessResponse } from '../common/decorators/api-success-response.decorator';
import { RoleAuth } from '../common/decorators/jwt-auth.decorator';

import { CreateOrderRequestDto } from './dto/create-order-request.dto';
import { OrdersService } from './orders.service';

import type { Request } from 'express';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: '주문서 초기 생성' })
  @RoleAuth(Role.CLIENT)
  @ApiSuccessResponse(HttpStatus.CREATED)
  @ApiErrorResponse(SERVICE_ERRORS.NOT_FOUND)
  @ApiErrorResponse(ORDER_ERRORS.FORBIDDEN_SELF_ORDER)
  @ApiErrorResponse(SERVICE_ERRORS.NOT_AVAILABLE)
  @ApiErrorResponse(COMMON_ERRORS.VALIDATION_ERROR)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  createOrder(@Req() req: Request, @Body() dto: CreateOrderRequestDto) {
    const user = req.user as JwtAccessUser;
    return this.ordersService.initializeOrder(user.userId, dto);
  }
}
