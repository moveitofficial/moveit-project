import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { COMMON_ERRORS } from '../../common/constants/errors';
import { ApiErrorResponse } from '../../common/decorators/api-error-response.decorator';
import { ApiSuccessResponse } from '../../common/decorators/api-success-response.decorator';
import { AdminJwtAccessGuard } from '../admin-auth/jwt/admin-jwt-access.guard';

import { AdminMainSettingService } from './admin-main-setting.service';
import { MainSettingResponseDto } from './dto/main-setting-response.dto';

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
}
