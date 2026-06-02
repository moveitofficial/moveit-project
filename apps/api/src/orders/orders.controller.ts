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
  REVIEW_ERRORS,
  SERVICE_ERRORS,
} from '../common/constants/errors';
import { ApiErrorResponse } from '../common/decorators/api-error-response.decorator';
import { ApiSuccessResponse } from '../common/decorators/api-success-response.decorator';
import { JwtAuth, RoleAuth } from '../common/decorators/jwt-auth.decorator';
import { OrderPaymentDto } from '../payments/dto/order-payment-response.dto';
import { PaymentsService } from '../payments/payments.service';
import { CreateReviewRequestDto } from '../services/dto/create-review-request.dto';
import { ReviewResponseDto } from '../services/dto/service-response.dto';
import { UpdateReviewRequestDto } from '../services/dto/update-review-request.dto';

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
