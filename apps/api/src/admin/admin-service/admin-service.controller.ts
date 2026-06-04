import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { COMMON_ERRORS, SERVICE_ERRORS } from '../../common/constants/errors';
import { ApiErrorResponse } from '../../common/decorators/api-error-response.decorator';
import { ApiSuccessResponse } from '../../common/decorators/api-success-response.decorator';
import { AppException } from '../../common/exceptions/app.exception';
import { AdminJwtAccessGuard } from '../admin-auth/jwt/admin-jwt-access.guard';

import { AdminServiceService } from './admin-service.service';
import { ServiceOrdersQueryDto } from './dto/service-orders-query.dto';
import {
  ServiceOrderCountsDto,
  ServiceOrdersResponseDto,
} from './dto/service-orders-response.dto';

@ApiTags('admin-service')
@Controller('admin/services')
export class AdminServiceController {
  constructor(private readonly adminServiceService: AdminServiceService) {}

  @ApiOperation({
    summary: '[어드민] 서비스별 주문 목록 (모달용)',
    description:
      '판매자 상세 페이지에서 등록 서비스 클릭 시 모달에 표시되는 주문 목록. 탭/검색/정렬/페이지네이션 지원, 탭 카운트 동봉.',
  })
  @ApiSuccessResponse(HttpStatus.OK, ServiceOrdersResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(SERVICE_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @UseGuards(AdminJwtAccessGuard)
  @Get(':serviceId/orders')
  getServiceOrders(
    @Param(
      'serviceId',
      new ParseUUIDPipe({
        exceptionFactory: () => new AppException(SERVICE_ERRORS.NOT_FOUND),
      }),
    )
    serviceId: string,
    @Query() query: ServiceOrdersQueryDto,
  ): Promise<ServiceOrdersResponseDto> {
    return this.adminServiceService.getServiceOrders(serviceId, query);
  }

  @ApiOperation({
    summary: '[어드민] 서비스별 주문 탭 카운트',
    description:
      '판매자 상세 모달 오픈 시 1회 호출. 필터 무관 전체 통계로 7개 탭 뱃지에 사용.',
  })
  @ApiSuccessResponse(HttpStatus.OK, ServiceOrderCountsDto)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(SERVICE_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @UseGuards(AdminJwtAccessGuard)
  @Get(':serviceId/orders/counts')
  getServiceOrderCounts(
    @Param(
      'serviceId',
      new ParseUUIDPipe({
        exceptionFactory: () => new AppException(SERVICE_ERRORS.NOT_FOUND),
      }),
    )
    serviceId: string,
  ): Promise<ServiceOrderCountsDto> {
    return this.adminServiceService.getServiceOrderCounts(serviceId);
  }
}
