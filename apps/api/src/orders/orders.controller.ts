import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
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
import { ApiSuccessResponse } from '../common/decorators/api-success-response.decorator';
import { JwtAuth, RoleAuth } from '../common/decorators/jwt-auth.decorator';

import { CreateOrderRequestDto } from './dto/create-order-request.dto';
import { UpdateOrderStatusRequestDto } from './dto/update-order-status-request.dto';
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

  @ApiOperation({ summary: '주문 상태 전이 (결제 검증 포함)' })
  @JwtAuth()
  @ApiSuccessResponse(HttpStatus.OK)
  @ApiErrorResponse(ORDER_ERRORS.NOT_FOUND, PAYMENT_ERRORS.NOT_FOUND)
  @ApiErrorResponse(ORDER_ERRORS.FORBIDDEN_NOT_OWNER)
  @ApiErrorResponse(
    ORDER_ERRORS.AMOUNT_MISMATCH,
    ORDER_ERRORS.INVALID_STATUS,
    COMMON_ERRORS.VALIDATION_ERROR,
  )
  @ApiErrorResponse(
    ORDER_ERRORS.ALREADY_CANCELED,
    ORDER_ERRORS.ALREADY_PROCESSED,
    PAYMENT_ERRORS.ALREADY_CONFIRMED,
  )
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @HttpCode(HttpStatus.OK)
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) orderId: string,
    @Req() req: Request,
    @Body() dto: UpdateOrderStatusRequestDto,
  ) {
    const user = req.user as JwtAccessUser;
    return this.ordersService.updateOrderStatus(
      user.userId,
      user.role,
      orderId,
      dto,
    );
  }
}
