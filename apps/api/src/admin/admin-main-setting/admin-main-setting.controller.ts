import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags, ApiBody, ApiConsumes } from '@nestjs/swagger';

import {
  BANNER_ERRORS,
  COMMON_ERRORS,
  MAIN_SETTING_ERRORS,
  UPLOAD_ERRORS,
} from '../../common/constants/errors';
import { ApiErrorResponse } from '../../common/decorators/api-error-response.decorator';
import { ApiSuccessResponse } from '../../common/decorators/api-success-response.decorator';
import { AdminJwtAccessGuard } from '../admin-auth/jwt/admin-jwt-access.guard';

import { AdminMainSettingService } from './admin-main-setting.service';
import { GetCandidatesQueryDto } from './dto/candidates-query.dto';
import {
  ExpertCandidatesResponseDto,
  ServiceCandidatesResponseDto,
} from './dto/candidates-response.dto';
import { DeleteBannerDto } from './dto/delete-banner.dto';
import { DeleteMainSettingDto } from './dto/delete-request.dto';
import {
  MainSettingResponseDto,
  BannerItemDto,
} from './dto/main-setting-response.dto';
import { RegisterBannerDto } from './dto/register-banner.dto';
import { RegisterMainSettingDto } from './dto/register-request.dto';

import type { AdminJwtAccessUser } from '../admin-auth/jwt/admin-jwt-access.strategy';
import type { Request } from 'express';

@ApiTags('admin-main-setting')
@Controller('admin/main-settings')
export class AdminMainSettingController {
  constructor(
    private readonly adminMainSettingService: AdminMainSettingService,
  ) {}

  @ApiOperation({
    summary: '[어드민] 메인세팅 현재 등록 목록',
    description:
      '메인 페이지의 6개 섹션(인기 IT코칭/프로젝트의뢰, 추천 IT코칭/프로젝트의뢰, moveit 인기 프로젝트의뢰 전문가/코칭) 현재 등록 목록 통합 조회. 띠배너는 별도 API.',
  })
  @ApiSuccessResponse(HttpStatus.OK, MainSettingResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @UseGuards(AdminJwtAccessGuard)
  @Get()
  getMainSettings(): Promise<MainSettingResponseDto> {
    return this.adminMainSettingService.getMainSettings();
  }

  @ApiOperation({
    summary: '[어드민] 서비스 후보 리스트 (등록 모달용)',
    description:
      '서비스 섹션 모달용 후보 리스트. sectionType별로 그룹(IT_COACHING / PROJECT_REQUEST) 자동 필터. 각 항목에 isAlreadyRegistered 플래그 포함.',
  })
  @ApiSuccessResponse(HttpStatus.OK, ServiceCandidatesResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @UseGuards(AdminJwtAccessGuard)
  @Get('services/candidates')
  getServiceCandidates(
    @Query() query: GetCandidatesQueryDto,
  ): Promise<ServiceCandidatesResponseDto> {
    return this.adminMainSettingService.getServiceCandidates(query);
  }

  @ApiOperation({
    summary: '[어드민] 전문가 후보 리스트 (등록 모달용)',
    description:
      '전문가 섹션 모달용 후보 리스트. sectionType별로 specialty 자동 필터, 승인된 전문가만. 각 항목에 isAlreadyRegistered 플래그 포함.',
  })
  @ApiSuccessResponse(HttpStatus.OK, ExpertCandidatesResponseDto)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @UseGuards(AdminJwtAccessGuard)
  @Get('experts/candidates')
  getExpertCandidates(
    @Query() query: GetCandidatesQueryDto,
  ): Promise<ExpertCandidatesResponseDto> {
    return this.adminMainSettingService.getExpertCandidates(query);
  }

  @ApiOperation({
    summary: '[어드민] 메인세팅 등록',
    description:
      '한 호출 = 한 sectionType. body의 targetIds는 서비스 섹션이면 service.id, 전문가 섹션이면 user.id. 한도(4), group 일치, 중복 등록 검증.',
  })
  @ApiSuccessResponse(HttpStatus.CREATED)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(MAIN_SETTING_ERRORS.LIMIT_EXCEEDED)
  @ApiErrorResponse(MAIN_SETTING_ERRORS.DUPLICATE)
  @ApiErrorResponse(MAIN_SETTING_ERRORS.GROUP_MISMATCH)
  @ApiErrorResponse(MAIN_SETTING_ERRORS.TARGET_NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @UseGuards(AdminJwtAccessGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async register(
    @Body() body: RegisterMainSettingDto,
    @Req() req: Request,
  ): Promise<void> {
    const { adminId } = req.user as AdminJwtAccessUser;
    await this.adminMainSettingService.register(body, adminId);
  }

  @ApiOperation({
    summary: '[어드민] 메인세팅 삭제',
    description:
      '한 호출 = 한 sectionType. mainSettingIds 다중. 존재·sectionType 일치 검증.',
  })
  @ApiSuccessResponse(HttpStatus.OK)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(MAIN_SETTING_ERRORS.NOT_FOUND)
  @ApiErrorResponse(MAIN_SETTING_ERRORS.SECTION_MISMATCH)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @UseGuards(AdminJwtAccessGuard)
  @HttpCode(HttpStatus.OK)
  @Delete()
  async delete(
    @Body() body: DeleteMainSettingDto,
    @Req() req: Request,
  ): Promise<void> {
    const { adminId } = req.user as AdminJwtAccessUser;
    await this.adminMainSettingService.delete(body, adminId);
  }

  @ApiOperation({
    summary: '[어드민] 띠배너 등록',
    description:
      '이미지(multipart) + actionUrl 받아 띠배너 등록. 최대 1개 한도. 이미지는 S3 banners/ 폴더로 업로드. 권장 크기 1176×164.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        actionUrl: {
          type: 'string',
          example: 'https://moveit.kr/promo/2026-summer',
        },
      },
      required: ['file', 'actionUrl'],
    },
  })
  @ApiSuccessResponse(HttpStatus.CREATED, BannerItemDto)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(BANNER_ERRORS.LIMIT_EXCEEDED)
  @ApiErrorResponse(UPLOAD_ERRORS.FILE_NOT_ATTACHED)
  @ApiErrorResponse(UPLOAD_ERRORS.INVALID_FILE_TYPE)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @UseGuards(AdminJwtAccessGuard)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  @Post('banners')
  registerBanner(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() body: RegisterBannerDto,
    @Req() req: Request,
  ): Promise<BannerItemDto> {
    const { adminId } = req.user as AdminJwtAccessUser;
    return this.adminMainSettingService.registerBanner(file, body, adminId);
  }

  @ApiOperation({
    summary: '[어드민] 띠배너 삭제',
    description: 'bannerIds 다중 삭제. DB + S3 같이 정리.',
  })
  @ApiSuccessResponse(HttpStatus.OK)
  @ApiErrorResponse(COMMON_ERRORS.UNAUTHORIZED)
  @ApiErrorResponse(BANNER_ERRORS.NOT_FOUND)
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)
  @UseGuards(AdminJwtAccessGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('banners')
  async deleteBanners(
    @Body() body: DeleteBannerDto,
    @Req() req: Request,
  ): Promise<void> {
    const { adminId } = req.user as AdminJwtAccessUser;
    await this.adminMainSettingService.deleteBanners(body, adminId);
  }
}
