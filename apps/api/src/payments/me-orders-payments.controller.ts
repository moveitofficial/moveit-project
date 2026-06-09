import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAccessUser } from '../auth/jwt/jwt-access.strategy';
import {
  COMMON_ERRORS,
  ORDER_ERRORS,
  PAYMENT_ERRORS,
} from '../common/constants/errors';
import { ApiErrorResponse } from '../common/decorators/api-error-response.decorator';
import { ApiSuccessResponse } from '../common/decorators/api-success-response.decorator';
import { JwtAuth } from '../common/decorators/jwt-auth.decorator';

import { OrderPaymentDto } from './dto/order-payment-response.dto';
import { PaymentsService } from './payments.service';

import type { Request } from 'express';

@ApiTags('users/me/orders')
@Controller('users/me/orders/:orderId/payment')
export class MeOrdersPaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @ApiOperation({ summary: '내 주문 결제·환불 상세' })
  @JwtAuth(ORDER_ERRORS.FORBIDDEN_NOT_OWNER)
  @ApiSuccessResponse(HttpStatus.OK, OrderPaymentDto)
  @ApiErrorResponse(ORDER_ERRORS.NOT_FOUND, PAYMENT_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Get()
  getOrderPayment(
    @Req() req: Request,
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ) {
    const user = req.user as JwtAccessUser;
    return this.paymentsService.getOrderPayment(user.userId, orderId);
  }
}
