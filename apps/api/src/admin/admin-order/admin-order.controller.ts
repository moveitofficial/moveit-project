import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { COMMON_ERRORS, ORDER_ERRORS } from '../../common/constants/errors';
import { ApiErrorResponse } from '../../common/decorators/api-error-response.decorator';
import { ApiSuccessResponse } from '../../common/decorators/api-success-response.decorator';
import { AppException } from '../../common/exceptions/app.exception';
import { AdminJwtAccessGuard } from '../admin-auth/jwt/admin-jwt-access.guard';

import { AdminOrderService } from './admin-order.service';
import { OrderRefundResponseDto } from './dto/order-refund-response.dto';
import { OrderTransactionResponseDto } from './dto/order-transaction-response.dto';

@ApiTags('admin-order')
@Controller('admin/orders')
export class AdminOrderController {
  constructor(private readonly adminOrderService: AdminOrderService) {}

  @ApiOperation({
    summary: '[어드민] 주문 거래상세 조회 (결제 정보 + 금액)',
    description:
      '주문 1건의 결제 일시·수단·방식 + 서비스 금액/수수료/최종 결제금액. 결제가 승인된 주문만 200, 그 외(주문 없음/결제 없음/미승인)는 404.',
  })
  @ApiSuccessResponse(HttpStatus.OK, OrderTransactionResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(ORDER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @UseGuards(AdminJwtAccessGuard)
  @Get(':orderId/transaction')
  getOrderTransaction(
    @Param(
      'orderId',
      new ParseUUIDPipe({
        exceptionFactory: () => new AppException(ORDER_ERRORS.NOT_FOUND),
      }),
    )
    orderId: string,
  ): Promise<OrderTransactionResponseDto> {
    return this.adminOrderService.getOrderTransaction(orderId);
  }

  @ApiOperation({
    summary: '[어드민] 주문 취소·환불 상세 조회',
    description:
      '주문 1건의 취소(CANCEL) 또는 환불(REFUND) 상세 — 결제 정보 + 취소·환불 금액 + 승인자(관리자 vs 판매자) 정보. type 으로 취소·환불 구분, approvedBy.type 으로 승인자 분기.',
  })
  @ApiSuccessResponse(HttpStatus.OK, OrderRefundResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(ORDER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @UseGuards(AdminJwtAccessGuard)
  @Get(':orderId/refund')
  getOrderRefund(
    @Param(
      'orderId',
      new ParseUUIDPipe({
        exceptionFactory: () => new AppException(ORDER_ERRORS.NOT_FOUND),
      }),
    )
    orderId: string,
  ): Promise<OrderRefundResponseDto> {
    return this.adminOrderService.getOrderRefund(orderId);
  }
}
