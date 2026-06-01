import {
  Body,
  Controller,
  Get,
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
} from '../common/constants/errors';
import { ApiErrorResponse } from '../common/decorators/api-error-response.decorator';
import { ApiSuccessResponse } from '../common/decorators/api-success-response.decorator';
import { JwtAuth, RoleAuth } from '../common/decorators/jwt-auth.decorator';
import { PaymentsService } from '../payments/payments.service';

import { OrderPaymentDto } from './dto/order-response.dto';
import { UpdateOrderScheduleRequestDto } from './dto/update-order-schedule-request.dto';
import { UpdateOrderScheduleResponseDto } from './dto/update-order-schedule-response.dto';
import { UpdateOrderStatusRequestDto } from './dto/update-order-status-request.dto';
import { UpdateOrderStatusResponseDto } from './dto/update-order-status-response.dto';
import { OrdersService } from './orders.service';

import type { Request } from 'express';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly paymentsService: PaymentsService,
  ) {}

  @ApiOperation({ summary: '주문 결제·환불 상세 (거래상세)' })
  @JwtAuth(ORDER_ERRORS.FORBIDDEN_NOT_OWNER)
  @ApiSuccessResponse(HttpStatus.OK, OrderPaymentDto)
  @ApiErrorResponse(ORDER_ERRORS.NOT_FOUND, PAYMENT_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Get(':id/payment')
  getOrderPayment(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) orderId: string,
  ) {
    const user = req.user as JwtAccessUser;
    return this.paymentsService.getOrderPayment(user.userId, orderId);
  }

  @ApiOperation({ summary: '주문 상태 전이' })
  @JwtAuth(ORDER_ERRORS.FORBIDDEN_NOT_OWNER)
  @ApiSuccessResponse(HttpStatus.OK, UpdateOrderStatusResponseDto)
  @ApiErrorResponse(ORDER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(ORDER_ERRORS.INVALID_STATUS, COMMON_ERRORS.VALIDATION_ERROR)
  @ApiErrorResponse(ORDER_ERRORS.ALREADY_PROCESSED)
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

  @ApiOperation({ summary: '주문 일정 등록·변경' })
  @JwtAuth(ORDER_ERRORS.FORBIDDEN_NOT_OWNER)
  @ApiSuccessResponse(HttpStatus.OK, UpdateOrderScheduleResponseDto)
  @ApiErrorResponse(ORDER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(ORDER_ERRORS.INVALID_STATUS, COMMON_ERRORS.VALIDATION_ERROR)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @HttpCode(HttpStatus.OK)
  @Patch(':id/schedule')
  updateSchedule(
    @Param('id', ParseUUIDPipe) orderId: string,
    @Req() req: Request,
    @Body() dto: UpdateOrderScheduleRequestDto,
  ) {
    const user = req.user as JwtAccessUser;
    return this.ordersService.updateOrderSchedule(
      user.userId,
      user.role,
      orderId,
      dto,
    );
  }

  @ApiOperation({ summary: '구매 확정' })
  @RoleAuth(Role.CLIENT, ORDER_ERRORS.FORBIDDEN_NOT_OWNER)
  @ApiSuccessResponse(HttpStatus.OK, UpdateOrderStatusResponseDto)
  @ApiErrorResponse(ORDER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(ORDER_ERRORS.INVALID_STATUS)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @HttpCode(HttpStatus.OK)
  @Post(':id/confirm')
  confirmOrder(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) orderId: string,
  ) {
    const user = req.user as JwtAccessUser;
    return this.ordersService.confirmOrder(user.userId, orderId);
  }

  @ApiOperation({ summary: '정산 요청' })
  @RoleAuth(Role.EXPERT, ORDER_ERRORS.FORBIDDEN_NOT_OWNER)
  @ApiSuccessResponse(HttpStatus.OK, UpdateOrderStatusResponseDto)
  @ApiErrorResponse(ORDER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(ORDER_ERRORS.INVALID_STATUS)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @HttpCode(HttpStatus.OK)
  @Post(':id/settlement-request')
  requestSettlement(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) orderId: string,
  ) {
    const user = req.user as JwtAccessUser;
    return this.ordersService.requestSettlement(user.userId, orderId);
  }
}
