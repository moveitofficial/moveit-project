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
  Query,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { JwtAccessUser } from '../auth/jwt/jwt-access.strategy';
import {
  COMMON_ERRORS,
  ORDER_ERRORS,
  REVIEW_ERRORS,
  SERVICE_ERRORS,
} from '../common/constants/errors';
import { ApiErrorResponse } from '../common/decorators/api-error-response.decorator';
import { ApiSuccessResponse } from '../common/decorators/api-success-response.decorator';
import {
  OptionalJwtAuth,
  RoleAuth,
} from '../common/decorators/jwt-auth.decorator';

import { CreateReviewRequestDto } from './dto/create-review-request.dto';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import {
  ReviewResponseDto,
  ServiceDetailResponseDto,
  ServiceListPaginatedResponseDto,
  ServiceListQueryDto,
  ServiceResponseDto,
  ServiceReviewsPaginatedResponseDto,
  ServiceReviewsQueryDto,
} from './dto/service-response.dto';
import { UpdateReviewRequestDto } from './dto/update-review-request.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';
import { UpdateServiceStatusRequestDto } from './dto/update-service-status-request.dto';
import { ServicesService } from './services.service';

import type { Request } from 'express';

@ApiTags('services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @ApiOperation({ summary: '서비스 목록 조회' })
  @ApiSuccessResponse(HttpStatus.OK, ServiceListPaginatedResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.VALIDATION_ERROR)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Get()
  findAll(@Query() query: ServiceListQueryDto) {
    return this.servicesService.getServices(query);
  }

  @ApiOperation({ summary: '서비스 리뷰 목록 조회' })
  @ApiSuccessResponse(HttpStatus.OK, ServiceReviewsPaginatedResponseDto)
  @ApiErrorResponse(SERVICE_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.VALIDATION_ERROR)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Get(':id/reviews')
  findReviews(
    @Param('id', ParseUUIDPipe) serviceId: string,
    @Query() query: ServiceReviewsQueryDto,
  ) {
    return this.servicesService.getServiceReviews(serviceId, query);
  }

  @ApiOperation({ summary: '서비스 리뷰 작성' })
  @RoleAuth(Role.CLIENT)
  @ApiSuccessResponse(HttpStatus.CREATED, ReviewResponseDto)
  @ApiErrorResponse(SERVICE_ERRORS.NOT_FOUND)
  @ApiErrorResponse(ORDER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(REVIEW_ERRORS.ORDER_NOT_REVIEWABLE)
  @ApiErrorResponse(REVIEW_ERRORS.ORDER_SERVICE_MISMATCH)
  @ApiErrorResponse(REVIEW_ERRORS.ALREADY_EXISTS)
  @ApiErrorResponse(COMMON_ERRORS.VALIDATION_ERROR)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @HttpCode(HttpStatus.CREATED)
  @Post(':id/reviews')
  createReview(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) serviceId: string,
    @Body() dto: CreateReviewRequestDto,
  ) {
    const user = req.user as JwtAccessUser;
    return this.servicesService.createServiceReview(
      user.userId,
      serviceId,
      dto,
    );
  }

  @ApiOperation({ summary: '서비스 리뷰 수정' })
  @RoleAuth(Role.CLIENT)
  @ApiSuccessResponse(HttpStatus.OK, ReviewResponseDto)
  @ApiErrorResponse(REVIEW_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.FORBIDDEN)
  @ApiErrorResponse(COMMON_ERRORS.VALIDATION_ERROR)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Patch(':id/reviews/:reviewId')
  patchReview(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) serviceId: string,
    @Param('reviewId', ParseUUIDPipe) reviewId: string,
    @Body() dto: UpdateReviewRequestDto,
  ) {
    const user = req.user as JwtAccessUser;
    return this.servicesService.updateServiceReview(
      user.userId,
      serviceId,
      reviewId,
      dto,
    );
  }

  @ApiOperation({ summary: '서비스 리뷰 삭제' })
  @RoleAuth(Role.CLIENT)
  @ApiSuccessResponse(HttpStatus.NO_CONTENT, ReviewResponseDto)
  @ApiErrorResponse(REVIEW_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.FORBIDDEN)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id/reviews/:reviewId')
  deleteReview(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) serviceId: string,
    @Param('reviewId', ParseUUIDPipe) reviewId: string,
  ) {
    const user = req.user as JwtAccessUser;
    return this.servicesService.deleteServiceReview(
      user.userId,
      serviceId,
      reviewId,
    );
  }

  @OptionalJwtAuth()
  @ApiOperation({ summary: '서비스 상세 조회' })
  @ApiSuccessResponse(HttpStatus.OK, ServiceDetailResponseDto)
  @ApiErrorResponse(SERVICE_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Get(':id')
  findOne(@Req() req: Request, @Param('id', ParseUUIDPipe) serviceId: string) {
    const user = req.user as JwtAccessUser | undefined;
    return this.servicesService.getServiceById(serviceId, user?.userId);
  }

  @ApiOperation({ summary: '전문가 서비스 등록' })
  @RoleAuth(Role.EXPERT)
  @ApiSuccessResponse(HttpStatus.CREATED, ServiceResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.VALIDATION_ERROR)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Req() req: Request, @Body() dto: CreateServiceRequestDto) {
    const user = req.user as JwtAccessUser;
    return this.servicesService.createService(user.userId, dto);
  }

  @ApiOperation({
    summary: '전문가 서비스 상태 변경',
    description: '서비스 상태 변경: ACTIVE(활성)/PAUSED(중지)',
  })
  @RoleAuth(Role.EXPERT)
  @ApiSuccessResponse(HttpStatus.OK, ServiceResponseDto)
  @ApiErrorResponse(SERVICE_ERRORS.FORBIDDEN_NOT_OWNER)
  @ApiErrorResponse(SERVICE_ERRORS.NOT_FOUND)
  @ApiErrorResponse(SERVICE_ERRORS.ALREADY_DELETED)
  @ApiErrorResponse(COMMON_ERRORS.VALIDATION_ERROR)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Patch(':id/status')
  patchStatus(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) serviceId: string,
    @Body() dto: UpdateServiceStatusRequestDto,
  ) {
    const user = req.user as JwtAccessUser;
    return this.servicesService.updateServiceStatus(
      user.userId,
      serviceId,
      dto,
    );
  }

  @ApiOperation({ summary: '전문가 서비스 수정 (상태 제외)' })
  @RoleAuth(Role.EXPERT)
  @ApiSuccessResponse(HttpStatus.OK, ServiceResponseDto)
  @ApiErrorResponse(SERVICE_ERRORS.FORBIDDEN_NOT_OWNER)
  @ApiErrorResponse(SERVICE_ERRORS.NOT_FOUND)
  @ApiErrorResponse(SERVICE_ERRORS.ALREADY_DELETED)
  @ApiErrorResponse(
    COMMON_ERRORS.VALIDATION_ERROR,
    SERVICE_ERRORS.IMAGE_PARTIAL_UPDATE,
  )
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Patch(':id')
  update(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) serviceId: string,
    @Body() dto: UpdateServiceRequestDto,
  ) {
    const user = req.user as JwtAccessUser;
    return this.servicesService.updateService(user.userId, serviceId, dto);
  }

  @ApiOperation({
    summary: '전문가 서비스 종료',
    description: '서비스 상태: CLOSED - 종료 처리',
  })
  @RoleAuth(Role.EXPERT)
  @ApiSuccessResponse(HttpStatus.OK, ServiceResponseDto)
  @ApiErrorResponse(SERVICE_ERRORS.FORBIDDEN_NOT_OWNER)
  @ApiErrorResponse(SERVICE_ERRORS.NOT_FOUND)
  @ApiErrorResponse(SERVICE_ERRORS.ALREADY_DELETED)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Delete(':id')
  close(@Req() req: Request, @Param('id', ParseUUIDPipe) serviceId: string) {
    const user = req.user as JwtAccessUser;
    return this.servicesService.closeService(user.userId, serviceId);
  }
}
