import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { JwtAccessUser } from '../auth/jwt/jwt-access.strategy';
import {
  COMMON_ERRORS,
  ORDER_ERRORS,
  PAYMENT_ERRORS,
  REFUND_ERRORS,
  REVIEW_ERRORS,
  SERVICE_ERRORS,
} from '../common/constants/errors';
import { ApiErrorResponse } from '../common/decorators/api-error-response.decorator';
import { ApiSuccessResponse } from '../common/decorators/api-success-response.decorator';
import { JwtAuth, RoleAuth } from '../common/decorators/jwt-auth.decorator';
import { CreateReviewRequestDto } from '../services/dto/create-review-request.dto';
import { ReviewResponseDto } from '../services/dto/service-response.dto';
import { UpdateReviewRequestDto } from '../services/dto/update-review-request.dto';

import { ApproveCancelRequestDto } from './dto/approve-cancel-request.dto';
import { CreateOrderRequestDto } from './dto/create-order-request.dto';
import { CreateOrderResponseDto } from './dto/create-order-response.dto';
import { OrderReviewResponseDto } from './dto/order-review-response.dto';
import { PayOrderRequestDto } from './dto/pay-order-request.dto';
import { ScheduleChangeRequestDto } from './dto/schedule-change-request.dto';
import { UpdateOrderScheduleRequestDto } from './dto/update-order-schedule-request.dto';
import { UpdateOrderScheduleResponseDto } from './dto/update-order-schedule-response.dto';
import { UpdateOrderStatusRequestDto } from './dto/update-order-status-request.dto';
import { UpdateOrderStatusResponseDto } from './dto/update-order-status-response.dto';
import { OrdersService } from './orders.service';

import type { Request } from 'express';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: '주문 생성 (결제 완료)' })
  @RoleAuth(Role.CLIENT)
  @ApiSuccessResponse(HttpStatus.CREATED, CreateOrderResponseDto)
  @ApiErrorResponse(SERVICE_ERRORS.NOT_FOUND)
  @ApiErrorResponse(
    SERVICE_ERRORS.NOT_AVAILABLE,
    PAYMENT_ERRORS.AMOUNT_MISMATCH,
    PAYMENT_ERRORS.FAILED,
    COMMON_ERRORS.VALIDATION_ERROR,
  )
  @ApiErrorResponse(
    ORDER_ERRORS.DUPLICATE_ORDER_ID,
    PAYMENT_ERRORS.ALREADY_CONFIRMED,
    PAYMENT_ERRORS.DUPLICATE_PAYMENT_KEY,
  )
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  createOrder(@Req() req: Request, @Body() dto: CreateOrderRequestDto) {
    const user = req.user as JwtAccessUser;
    return this.ordersService.createOrder(user.userId, dto);
  }

  @ApiOperation({ summary: '거래 요청 결제 (PENDING → NEGOTIATING)' })
  @RoleAuth(Role.CLIENT, ORDER_ERRORS.FORBIDDEN_NOT_OWNER)
  @ApiSuccessResponse(HttpStatus.OK, CreateOrderResponseDto)
  @ApiErrorResponse(ORDER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(
    ORDER_ERRORS.INVALID_STATUS,
    PAYMENT_ERRORS.AMOUNT_MISMATCH,
    PAYMENT_ERRORS.FAILED,
    COMMON_ERRORS.VALIDATION_ERROR,
  )
  @ApiErrorResponse(
    PAYMENT_ERRORS.ALREADY_CONFIRMED,
    PAYMENT_ERRORS.DUPLICATE_PAYMENT_KEY,
  )
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @HttpCode(HttpStatus.OK)
  @Post(':id/pay')
  payOrder(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) orderId: string,
    @Body() dto: PayOrderRequestDto,
  ) {
    const user = req.user as JwtAccessUser;
    return this.ordersService.payOrder(user.userId, orderId, dto);
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

  @ApiOperation({
    summary: '일정 변경 요청 (전문가 → SCHEDULE_CHANGE_REQUEST 시스템 메시지)',
  })
  @RoleAuth(Role.EXPERT, ORDER_ERRORS.FORBIDDEN_NOT_OWNER)
  @ApiSuccessResponse(HttpStatus.OK)
  @ApiErrorResponse(ORDER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(ORDER_ERRORS.INVALID_STATUS, COMMON_ERRORS.VALIDATION_ERROR)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @HttpCode(HttpStatus.OK)
  @Post(':id/schedule-change-request')
  requestScheduleChange(
    @Param('id', ParseUUIDPipe) orderId: string,
    @Req() req: Request,
    @Body() dto: ScheduleChangeRequestDto,
  ) {
    const user = req.user as JwtAccessUser;
    return this.ordersService.requestScheduleChange(user.userId, orderId, dto);
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

  @ApiOperation({ summary: '취소 승인' })
  @RoleAuth(Role.EXPERT, ORDER_ERRORS.FORBIDDEN_NOT_OWNER)
  @ApiSuccessResponse(HttpStatus.OK, UpdateOrderStatusResponseDto)
  @ApiErrorResponse(ORDER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(
    REFUND_ERRORS.NOT_APPROVABLE,
    PAYMENT_ERRORS.NOT_FOUND,
    ORDER_ERRORS.ALREADY_PROCESSED,
    PAYMENT_ERRORS.CANCEL_FAILED,
  )
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @HttpCode(HttpStatus.OK)
  @Post(':id/cancel/approve')
  approveCancel(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) orderId: string,
    @Body() dto: ApproveCancelRequestDto,
  ) {
    const user = req.user as JwtAccessUser;
    return this.ordersService.approveCancelOrder(
      user.userId,
      orderId,
      dto.roomId,
    );
  }

  @ApiOperation({ summary: '취소 거절' })
  @RoleAuth(Role.EXPERT, ORDER_ERRORS.FORBIDDEN_NOT_OWNER)
  @ApiSuccessResponse(HttpStatus.OK, UpdateOrderStatusResponseDto)
  @ApiErrorResponse(ORDER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(
    REFUND_ERRORS.NOT_APPROVABLE,
    ORDER_ERRORS.ALREADY_PROCESSED,
  )
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @HttpCode(HttpStatus.OK)
  @Post(':id/cancel/reject')
  rejectCancel(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) orderId: string,
  ) {
    const user = req.user as JwtAccessUser;
    return this.ordersService.rejectCancelOrder(user.userId, orderId);
  }

  @ApiOperation({ summary: '환불 승인' })
  @RoleAuth(Role.EXPERT, ORDER_ERRORS.FORBIDDEN_NOT_OWNER)
  @ApiSuccessResponse(HttpStatus.OK, UpdateOrderStatusResponseDto)
  @ApiErrorResponse(ORDER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(
    REFUND_ERRORS.NOT_APPROVABLE,
    PAYMENT_ERRORS.NOT_FOUND,
    ORDER_ERRORS.ALREADY_PROCESSED,
    PAYMENT_ERRORS.CANCEL_FAILED,
  )
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @HttpCode(HttpStatus.OK)
  @Post(':id/refund/approve')
  approveRefund(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) orderId: string,
  ) {
    const user = req.user as JwtAccessUser;
    return this.ordersService.approveRefundOrder(user.userId, orderId);
  }

  @ApiOperation({ summary: '환불 거절' })
  @RoleAuth(Role.EXPERT, ORDER_ERRORS.FORBIDDEN_NOT_OWNER)
  @ApiSuccessResponse(HttpStatus.OK, UpdateOrderStatusResponseDto)
  @ApiErrorResponse(ORDER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(
    REFUND_ERRORS.NOT_APPROVABLE,
    ORDER_ERRORS.ALREADY_PROCESSED,
  )
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @HttpCode(HttpStatus.OK)
  @Post(':id/refund/reject')
  rejectRefund(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) orderId: string,
  ) {
    const user = req.user as JwtAccessUser;
    return this.ordersService.rejectRefundOrder(user.userId, orderId);
  }

  @ApiOperation({ summary: '리뷰 단건 조회 (모달용)' })
  @RoleAuth(Role.CLIENT, ORDER_ERRORS.FORBIDDEN_NOT_OWNER)
  @ApiSuccessResponse(HttpStatus.OK, OrderReviewResponseDto)
  @ApiErrorResponse(ORDER_ERRORS.NOT_FOUND, REVIEW_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Get(':id/reviews')
  getOrderReview(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) orderId: string,
  ) {
    const user = req.user as JwtAccessUser;
    return this.ordersService.getOrderReview(user.userId, orderId);
  }

  @ApiOperation({ summary: '리뷰 작성' })
  @RoleAuth(Role.CLIENT)
  @ApiSuccessResponse(HttpStatus.OK, ReviewResponseDto)
  @ApiErrorResponse(ORDER_ERRORS.NOT_FOUND, SERVICE_ERRORS.NOT_FOUND)
  @ApiErrorResponse(ORDER_ERRORS.FORBIDDEN_NOT_OWNER)
  @ApiErrorResponse(REVIEW_ERRORS.ORDER_NOT_REVIEWABLE)
  @ApiErrorResponse(REVIEW_ERRORS.ALREADY_EXISTS)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @HttpCode(HttpStatus.OK)
  @Post(':id/reviews')
  createReview(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) orderId: string,
    @Body() dto: CreateReviewRequestDto,
  ) {
    const user = req.user as JwtAccessUser;
    return this.ordersService.createReview(user.userId, orderId, dto);
  }

  @ApiOperation({ summary: '리뷰 수정' })
  @RoleAuth(Role.CLIENT)
  @ApiSuccessResponse(HttpStatus.OK, ReviewResponseDto)
  @ApiErrorResponse(REVIEW_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.FORBIDDEN)
  @ApiErrorResponse(REVIEW_ERRORS.ORDER_REVIEW_MISMATCH)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @HttpCode(HttpStatus.OK)
  @Patch(':id/reviews/:reviewId')
  updateReview(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) orderId: string,
    @Param('reviewId', ParseUUIDPipe) reviewId: string,
    @Body() dto: UpdateReviewRequestDto,
  ) {
    const user = req.user as JwtAccessUser;
    return this.ordersService.updateReview(user.userId, orderId, reviewId, dto);
  }

  @ApiOperation({ summary: '리뷰 삭제' })
  @RoleAuth(Role.CLIENT)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: '리뷰 삭제 성공',
  })
  @ApiErrorResponse(REVIEW_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.FORBIDDEN)
  @ApiErrorResponse(REVIEW_ERRORS.ORDER_REVIEW_MISMATCH)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Delete(':id/reviews/:reviewId')
  deleteReview(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) orderId: string,
    @Param('reviewId', ParseUUIDPipe) reviewId: string,
  ) {
    const user = req.user as JwtAccessUser;
    return this.ordersService.deleteReview(user.userId, orderId, reviewId);
  }
}
