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
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAccessUser } from '../auth/jwt/jwt-access.strategy';
import { COMMON_ERRORS, SERVICE_ERRORS } from '../common/constants/errors';
import { ApiErrorResponse } from '../common/decorators/api-error-response.decorator';
import { ApiSuccessResponse } from '../common/decorators/api-success-response.decorator';
import { JwtAuth } from '../common/decorators/jwt-auth.decorator';

import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import {
  ServiceListDataDto,
  ServiceResponseDto,
} from './dto/service-response.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';
import { UpdateServiceStatusRequestDto } from './dto/update-service-status-request.dto';
import { ServicesService } from './services.service';

import type { Request } from 'express';

@ApiTags('services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @ApiOperation({ summary: '서비스 목록 조회' })
  @ApiSuccessResponse(HttpStatus.OK, ServiceListDataDto)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Get()
  findAll() {
    return this.servicesService.getServices();
  }

  @ApiOperation({ summary: '서비스 상세 조회' })
  @ApiSuccessResponse(HttpStatus.OK, ServiceResponseDto)
  @ApiErrorResponse(SERVICE_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) serviceId: string) {
    return this.servicesService.getServiceById(serviceId);
  }

  @ApiOperation({ summary: '전문가 서비스 등록' })
  @JwtAuth()
  @ApiSuccessResponse(HttpStatus.CREATED, ServiceResponseDto)
  @ApiErrorResponse(SERVICE_ERRORS.EXPERT_ROLE_REQUIRED)
  @ApiErrorResponse(COMMON_ERRORS.VALIDATION_ERROR)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Req() req: Request, @Body() dto: CreateServiceRequestDto) {
    const user = req.user as JwtAccessUser;
    return this.servicesService.createService(user.userId, user.role, dto);
  }

  @ApiOperation({
    summary: '전문가 서비스 상태 변경',
    description: '서비스 상태 변경: ACTIVE(활성)/PAUSED(중지)/CLOSED(종료)',
  })
  @JwtAuth()
  @ApiSuccessResponse(HttpStatus.OK, ServiceResponseDto)
  @ApiErrorResponse(
    SERVICE_ERRORS.EXPERT_ROLE_REQUIRED,
    SERVICE_ERRORS.FORBIDDEN_NOT_OWNER,
  )
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
      user.role,
      serviceId,
      dto,
    );
  }

  @ApiOperation({ summary: '전문가 서비스 수정 (상태 제외)' })
  @JwtAuth()
  @ApiSuccessResponse(HttpStatus.OK, ServiceResponseDto)
  @ApiErrorResponse(
    SERVICE_ERRORS.EXPERT_ROLE_REQUIRED,
    SERVICE_ERRORS.FORBIDDEN_NOT_OWNER,
  )
  @ApiErrorResponse(SERVICE_ERRORS.NOT_FOUND)
  @ApiErrorResponse(SERVICE_ERRORS.ALREADY_DELETED)
  @ApiErrorResponse(COMMON_ERRORS.VALIDATION_ERROR)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Patch(':id')
  update(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) serviceId: string,
    @Body() dto: UpdateServiceRequestDto,
  ) {
    const user = req.user as JwtAccessUser;
    return this.servicesService.updateService(
      user.userId,
      user.role,
      serviceId,
      dto,
    );
  }

  @ApiOperation({
    summary: '전문가 서비스 종료',
    description: '서비스 상태: CLOSED - 종료 처리',
  })
  @JwtAuth()
  @ApiSuccessResponse(HttpStatus.OK, ServiceResponseDto)
  @ApiErrorResponse(
    SERVICE_ERRORS.EXPERT_ROLE_REQUIRED,
    SERVICE_ERRORS.FORBIDDEN_NOT_OWNER,
  )
  @ApiErrorResponse(SERVICE_ERRORS.NOT_FOUND)
  @ApiErrorResponse(SERVICE_ERRORS.ALREADY_DELETED)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Delete(':id')
  remove(@Req() req: Request, @Param('id', ParseUUIDPipe) serviceId: string) {
    const user = req.user as JwtAccessUser;
    return this.servicesService.closeService(user.userId, user.role, serviceId);
  }
}
