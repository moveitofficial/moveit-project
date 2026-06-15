import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
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
  REFUND_ERRORS,
} from '../common/constants/errors';
import { ApiErrorResponse } from '../common/decorators/api-error-response.decorator';
import {
  ApiPaginatedResponse,
  ApiSuccessResponse,
} from '../common/decorators/api-success-response.decorator';
import { JwtAuth, RoleAuth } from '../common/decorators/jwt-auth.decorator';

import { GetOrdersQueryDto } from './dto/get-orders-query.dto';
import { OrderListItemDto } from './dto/order-response.dto';
import { UpdateOrderStatusResponseDto } from './dto/update-order-status-response.dto';
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

  @ApiOperation({ summary: '취소 요청' })
  @RoleAuth(Role.CLIENT, ORDER_ERRORS.FORBIDDEN_NOT_OWNER)
  @ApiSuccessResponse(HttpStatus.OK, UpdateOrderStatusResponseDto)
  @ApiErrorResponse(ORDER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(
    ORDER_ERRORS.INVALID_STATUS,
    ORDER_ERRORS.ALREADY_PROCESSED,
    REFUND_ERRORS.CANCEL_NOT_ALLOWED,
    REFUND_ERRORS.ALREADY_REQUESTED,
    PAYMENT_ERRORS.NOT_FOUND,
  )
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @HttpCode(HttpStatus.OK)
  @Post(':orderId/cancel')
  requestCancel(
    @Req() req: Request,
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ) {
    const user = req.user as JwtAccessUser;
    return this.ordersService.requestCancelOrder(user.userId, orderId);
  }

  @ApiOperation({ summary: '환불 요청' })
  @RoleAuth(Role.CLIENT, ORDER_ERRORS.FORBIDDEN_NOT_OWNER)
  @ApiSuccessResponse(HttpStatus.OK, UpdateOrderStatusResponseDto)
  @ApiErrorResponse(ORDER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(
    ORDER_ERRORS.INVALID_STATUS,
    ORDER_ERRORS.ALREADY_PROCESSED,
    REFUND_ERRORS.REFUND_NOT_ALLOWED,
    REFUND_ERRORS.ALREADY_REQUESTED,
    PAYMENT_ERRORS.NOT_FOUND,
  )
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @HttpCode(HttpStatus.OK)
  @Post(':orderId/refund')
  requestRefund(
    @Req() req: Request,
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ) {
    const user = req.user as JwtAccessUser;
    return this.ordersService.requestRefundOrder(user.userId, orderId);
  }

  @ApiOperation({ summary: '환불 요청 취소' })
  @RoleAuth(Role.CLIENT, ORDER_ERRORS.FORBIDDEN_NOT_OWNER)
  @ApiSuccessResponse(HttpStatus.OK, UpdateOrderStatusResponseDto)
  @ApiErrorResponse(ORDER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(
    ORDER_ERRORS.INVALID_STATUS,
    REFUND_ERRORS.REQUEST_NOT_CANCELABLE,
    REFUND_ERRORS.NOT_FOUND,
  )
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @HttpCode(HttpStatus.OK)
  @Post(':orderId/refund/cancel')
  cancelRefundRequest(
    @Req() req: Request,
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ) {
    const user = req.user as JwtAccessUser;
    return this.ordersService.cancelRefundRequestOrder(user.userId, orderId);
  }
}
