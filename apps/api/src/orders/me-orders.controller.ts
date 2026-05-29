import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { JwtAccessUser } from '../auth/jwt/jwt-access.strategy';
import {
  COMMON_ERRORS,
  ORDER_ERRORS,
  PAYMENT_ERRORS,
  SERVICE_ERRORS,
} from '../common/constants/errors';
import { ApiErrorResponse } from '../common/decorators/api-error-response.decorator';
import {
  ApiPaginatedResponse,
  ApiSuccessResponse,
} from '../common/decorators/api-success-response.decorator';
import { JwtAuth, RoleAuth } from '../common/decorators/jwt-auth.decorator';

import { CreateOrderRequestDto } from './dto/create-order-request.dto';
import { CreateOrderResponseDto } from './dto/create-order-response.dto';
import { GetOrdersQueryDto } from './dto/get-orders-query.dto';
import { OrderListItemDto } from './dto/order-response.dto';
import { OrdersService } from './orders.service';

import type { Request } from 'express';

@ApiTags('users/me/orders')
@Controller('users/me/orders')
export class MeOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: '내 주문 목록 조회' })
  @JwtAuth()
  @ApiPaginatedResponse(HttpStatus.OK, OrderListItemDto)
  @ApiErrorResponse(COMMON_ERRORS.VALIDATION_ERROR)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Get()
  getOrders(@Req() req: Request, @Query() query: GetOrdersQueryDto) {
    const user = req.user as JwtAccessUser;
    return this.ordersService.getOrders(user.userId, query);
  }

  @ApiOperation({ summary: '주문 생성 (결제 완료)' })
  @RoleAuth(Role.CLIENT)
  @ApiSuccessResponse(HttpStatus.CREATED, CreateOrderResponseDto)
  @ApiErrorResponse(SERVICE_ERRORS.NOT_FOUND)
  @ApiErrorResponse(SERVICE_ERRORS.NOT_AVAILABLE)
  @ApiErrorResponse(
    ORDER_ERRORS.AMOUNT_MISMATCH,
    COMMON_ERRORS.VALIDATION_ERROR,
    PAYMENT_ERRORS.DUPLICATE_PAYMENT_KEY,
  )
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  createOrder(@Req() req: Request, @Body() dto: CreateOrderRequestDto) {
    const user = req.user as JwtAccessUser;
    return this.ordersService.initializeOrder(user.userId, dto);
  }
}
