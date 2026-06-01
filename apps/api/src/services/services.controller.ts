import { randomUUID } from 'node:crypto';

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
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { JwtAccessUser } from '../auth/jwt/jwt-access.strategy';
import {
  COMMON_ERRORS,
  SERVICE_ERRORS,
  UPLOAD_ERRORS,
} from '../common/constants/errors';
import { ApiErrorResponse } from '../common/decorators/api-error-response.decorator';
import { ApiFileBody } from '../common/decorators/api-file-body.decorator';
import { ApiSuccessResponse } from '../common/decorators/api-success-response.decorator';
import {
  OptionalJwtAuth,
  RoleAuth,
} from '../common/decorators/jwt-auth.decorator';
import { UploadServiceImagesResponseDto } from '../upload/dto/upload-response.dto';
import { UploadService } from '../upload/upload.service';

import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import {
  ServiceDetailResponseDto,
  ServiceListItemResponseDto,
  ServiceListPaginatedResponseDto,
  ServiceListQueryDto,
  ServiceResponseDto,
} from './dto/service-response.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';
import { UpdateServiceStatusRequestDto } from './dto/update-service-status-request.dto';
import { ServicesService } from './services.service';

import type { Request } from 'express';

@ApiTags('services')
@Controller('services')
export class ServicesController {
  constructor(
    private readonly servicesService: ServicesService,
    private readonly uploadService: UploadService,
  ) {}

  @ApiOperation({ summary: '서비스 목록 조회' })
  @ApiSuccessResponse(HttpStatus.OK, ServiceListPaginatedResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.VALIDATION_ERROR)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Get()
  findAll(@Query() query: ServiceListQueryDto) {
    return this.servicesService.getServices(query);
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
  @ApiErrorResponse(
    COMMON_ERRORS.VALIDATION_ERROR,
    SERVICE_ERRORS.MAIN_IMAGE_REQUIRED,
    SERVICE_ERRORS.DETAIL_IMAGE_INVALID,
  )
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
  @RoleAuth(Role.EXPERT, SERVICE_ERRORS.FORBIDDEN_NOT_OWNER)
  @ApiSuccessResponse(HttpStatus.OK, ServiceResponseDto)
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
  @RoleAuth(Role.EXPERT, SERVICE_ERRORS.FORBIDDEN_NOT_OWNER)
  @ApiSuccessResponse(HttpStatus.OK, ServiceResponseDto)
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
  @RoleAuth(Role.EXPERT, SERVICE_ERRORS.FORBIDDEN_NOT_OWNER)
  @ApiSuccessResponse(HttpStatus.OK, ServiceResponseDto)
  @ApiErrorResponse(SERVICE_ERRORS.NOT_FOUND)
  @ApiErrorResponse(SERVICE_ERRORS.ALREADY_DELETED)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Delete(':id')
  close(@Req() req: Request, @Param('id', ParseUUIDPipe) serviceId: string) {
    const user = req.user as JwtAccessUser;
    return this.servicesService.closeService(user.userId, serviceId);
  }

  @ApiOperation({ summary: '이 전문가의 다른 서비스 조회' })
  @ApiSuccessResponse(HttpStatus.OK, [ServiceListItemResponseDto])
  @ApiErrorResponse(SERVICE_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Get(':id/others')
  findOthers(@Param('id', ParseUUIDPipe) serviceId: string) {
    return this.servicesService.getOtherServicesByExpertId(serviceId);
  }

  @ApiOperation({ summary: '서비스 이미지 업로드' })
  @RoleAuth(Role.EXPERT)
  @ApiConsumes('multipart/form-data')
  @ApiFileBody([
    { name: 'mainImage' },
    { name: 'detailImages', multiple: true },
  ])
  @ApiSuccessResponse(HttpStatus.CREATED, UploadServiceImagesResponseDto)
  @ApiErrorResponse(
    UPLOAD_ERRORS.FILE_NOT_ATTACHED,
    UPLOAD_ERRORS.INVALID_FILE_TYPE,
    UPLOAD_ERRORS.IMAGE_METADATA_UNREADABLE,
    UPLOAD_ERRORS.IMAGE_WIDTH_TOO_SMALL,
    UPLOAD_ERRORS.IMAGE_HEIGHT_TOO_LARGE,
  )
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @Post('upload')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'mainImage', maxCount: 1 },
      { name: 'detailImages', maxCount: 10 },
    ]),
  )
  async uploadServiceImages(
    @UploadedFiles()
    files:
      | {
          mainImage?: Express.Multer.File[];
          detailImages?: Express.Multer.File[];
        }
      | undefined,
  ) {
    const serviceId = randomUUID();
    const [mainImage, detailImages] = await Promise.all([
      this.uploadService.uploadImages(
        files?.mainImage,
        `services/${serviceId}`,
      ),
      this.uploadService.uploadImages(
        files?.detailImages,
        `services/${serviceId}`,
      ),
    ]);
    return { serviceId, mainImage: mainImage[0], detailImages };
  }
}
