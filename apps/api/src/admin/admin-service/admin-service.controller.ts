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
import {
  ApiPaginatedResponse,
  ApiSuccessResponse,
} from '../../common/decorators/api-success-response.decorator';
import { AppException } from '../../common/exceptions/app.exception';
import { Paginated } from '../../common/types/paginated.type';
import { AdminJwtAccessGuard } from '../admin-auth/jwt/admin-jwt-access.guard';

import { AdminServiceService } from './admin-service.service';
import { GetServicesQueryDto } from './dto/list/services-query.dto';
import { ServiceItemDto } from './dto/list/services-response.dto';
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

  @ApiOperation({
    summary: '[어드민] 서비스 리스트',
    description:
      '전체 서비스 리스트. 카테고리 그룹·상태로 필터, 서비스명 부분 일치 검색. 등록일 최근순. 소프트딜리트(CLOSED) 포함 모든 상태 노출.',
  })
  @ApiPaginatedResponse(HttpStatus.OK, ServiceItemDto)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @UseGuards(AdminJwtAccessGuard)
  @Get()
  getServices(
    @Query() query: GetServicesQueryDto,
  ): Promise<Paginated<ServiceItemDto>> {
    return this.adminServiceService.getServices(query);
  }
}
