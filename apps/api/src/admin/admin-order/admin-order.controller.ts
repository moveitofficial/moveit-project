import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { COMMON_ERRORS, ORDER_ERRORS } from '../../common/constants/errors';
import { ApiErrorResponse } from '../../common/decorators/api-error-response.decorator';
import {
  ApiPaginatedResponse,
  ApiSuccessResponse,
} from '../../common/decorators/api-success-response.decorator';
import { AppException } from '../../common/exceptions/app.exception';
import { Paginated } from '../../common/types/paginated.type';
import { AdminJwtAccessGuard } from '../admin-auth/jwt/admin-jwt-access.guard';

import { AdminOrderService } from './admin-order.service';
import { OrdersCountsDto } from './dto/list/orders-counts-response.dto';
import { GetOrdersQueryDto } from './dto/list/orders-query.dto';
import { OrderItemDto } from './dto/list/orders-response.dto';
import { OrderRefundResponseDto } from './dto/order-refund-response.dto';
import { OrderSettlementPreviewResponseDto } from './dto/order-settlement-preview-response.dto';
import { OrderSettlementResponseDto } from './dto/order-settlement-response.dto';
import { OrderTransactionResponseDto } from './dto/order-transaction-response.dto';

import type { AdminJwtAccessUser } from '../admin-auth/jwt/admin-jwt-access.strategy';
import type { Request } from 'express';

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

  @ApiOperation({
    summary: '[어드민] 정산 미리보기 조회 (입금 확인 모달)',
    description:
      '정산요청(SETTLEMENT_REQUESTED) 상태 주문 1건의 판매자 회사명·은행·계좌·입금 금액. "정산완료" 버튼 클릭 시 뜨는 입금 확인 모달 데이터. 정산요청 상태가 아니거나 주문이 없으면 404.',
  })
  @ApiSuccessResponse(HttpStatus.OK, OrderSettlementPreviewResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(ORDER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @UseGuards(AdminJwtAccessGuard)
  @Get(':orderId/settlement/preview')
  getOrderSettlementPreview(
    @Param(
      'orderId',
      new ParseUUIDPipe({
        exceptionFactory: () => new AppException(ORDER_ERRORS.NOT_FOUND),
      }),
    )
    orderId: string,
  ): Promise<OrderSettlementPreviewResponseDto> {
    return this.adminOrderService.getOrderSettlementPreview(orderId);
  }

  @ApiOperation({
    summary: '[어드민] 정산 완료 처리',
    description:
      '정산요청(SETTLEMENT_REQUESTED) 상태 주문을 정산완료(SETTLEMENT_COMPLETED)로 전환. settledAt·settledByAdminId 기록 + 활동로그 + 판매자에게 정산완료 알림 발송. 정산요청 상태가 아니거나 주문이 없으면 404.',
  })
  @ApiSuccessResponse(HttpStatus.OK)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(ORDER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @UseGuards(AdminJwtAccessGuard)
  @HttpCode(HttpStatus.OK)
  @Patch(':orderId/settlement')
  completeSettlement(
    @Param(
      'orderId',
      new ParseUUIDPipe({
        exceptionFactory: () => new AppException(ORDER_ERRORS.NOT_FOUND),
      }),
    )
    orderId: string,
    @Req() req: Request,
  ): Promise<void> {
    const { adminId } = req.user as AdminJwtAccessUser;
    return this.adminOrderService.completeSettlement(orderId, adminId);
  }

  @ApiOperation({
    summary: '[어드민] 정산 상세 조회',
    description:
      '정산완료(SETTLEMENT_COMPLETED) 상태 주문 1건의 결제정보 + 금액 + 정산 담당자 정보. 정산 상세 모달용. 정산완료 상태가 아니거나 주문이 없으면 404.',
  })
  @ApiSuccessResponse(HttpStatus.OK, OrderSettlementResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(ORDER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @UseGuards(AdminJwtAccessGuard)
  @Get(':orderId/settlement')
  getOrderSettlement(
    @Param(
      'orderId',
      new ParseUUIDPipe({
        exceptionFactory: () => new AppException(ORDER_ERRORS.NOT_FOUND),
      }),
    )
    orderId: string,
  ): Promise<OrderSettlementResponseDto> {
    return this.adminOrderService.getOrderSettlement(orderId);
  }

  @ApiOperation({
    summary: '[어드민] 전체 주문 리스트',
    description:
      '전체 주문 내역. 탭 (all/working/workCompleted/purchaseConfirmed/settlement/expired/deadlineImminent/cancelRefund) + 정렬 (latest/deadline) + 검색 (구매자 이름 + 판매자 회사명 OR).',
  })
  @ApiPaginatedResponse(HttpStatus.OK, OrderItemDto)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @UseGuards(AdminJwtAccessGuard)
  @Get()
  getOrders(
    @Query() query: GetOrdersQueryDto,
  ): Promise<Paginated<OrderItemDto>> {
    return this.adminOrderService.getOrders(query);
  }

  @ApiOperation({
    summary: '[어드민] 전체 주문 탭 카운트',
    description:
      '탭별 주문 수 (필터 무관). 전체/작업·논의중/작업완료/구매확정/정산요청·완료/기한만료/마감임박/환불·취소.',
  })
  @ApiSuccessResponse(HttpStatus.OK, OrdersCountsDto)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @UseGuards(AdminJwtAccessGuard)
  @Get('counts')
  getOrdersCounts(): Promise<OrdersCountsDto> {
    return this.adminOrderService.getOrdersCounts();
  }
}
